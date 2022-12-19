var express = require('express');
const { notificationDayBefore } = require('../models/AppointmentModel');
//const { rawListeners } = require('../app');
const notification = require("../models/NotificationModel");
var Appointment = require('../models/AppointmentModel');
var { Doctor } = require("../models/UserModel");

var router = express.Router();
const appointment_duration = 30;
const add_hour = (date) => {date.setHours(date.getHours() + 1); return date;} 
const curr_date_factory = ()=> {return add_hour(new Date())}

// IMPORTANT!!!!
// once we get the authentification and session working you will not need to send id and role


// get all appointemnts from an `id` with `role`
router.get('/', async function(req, res, next) {
  let role = req.query.role
  let id   = req.query.id
  if (role == 'admin')
    throw 'no admin here'
  let field = {'doctor':'doctorId', 'patient':'patientId', 'nurse':'nurseId'}[role]
  let apps = await Appointment.fetchBy(field, id)
  res.json(apps);
});

// create appointment with `patientId`, nurse or doctor id 
// time and duration
// this creates only one appointment and it can have any length
router.post('/add', async function(req, res, next) {
  if ((req.query.doctorId===undefined) === (req.query.nurseId===undefined))
    throw 'cannot both be defined'

  let app = new Appointment(
    id = undefined,
    req.query.patientId,
    req.query.doctorId,
    req.query.nurseId,
    req.query.time,
    req.query.duration
  )

  if (await app.conflictsWithDb())
    res.status(500).send('Appointment overlaps.')
  else if (await app.isSavedToDb())
    res.status(500).send('Appointment exists.')
  else {
    app.saveToDb();
    res.send("OK");
  }
});


/*
Makes a block of appointments between `time_start` and `time_end` of
length `appointment_duration`.

So if time_start is "2022-12-12 10:00:00" and time_end is "2022-12-12 11:45:00"
that would create the following appointments (times of start, appointment_duration===30):
  - "2022-12-12 10:00:00"
  - "2022-12-12 10:30:00"
  - "2022-12-12 11:00:00"

`appointment_duration` is set at the beginning of the file and is in minutes.

needed in the query:
    time_start: string ("YYYY-MM-DD HH:MM:SS")
    time_end  : string ("YYYY-MM-DD HH:MM:SS")
    nurseid or doctorid: int
*/
router.post('/add_range', async function(req, res, next) {
  
  if ((req.query.doctorid===undefined) === (req.query.nurseid===undefined))
    throw 'cannot both be defined'

  console.log('the date is ' + req.query.time_start )
  
  const loop_over_appointments = async (func) => {
    // Parse the start and end times as Date objects
    const startTime = add_hour(new Date(Date.parse(req.query.time_start)));
    const endTime   = add_hour(new Date(Date.parse(req.query.time_end)));

    // Set the current time to the start time
    let currentTime = startTime;

    // Loop until the current time is past the end time
    while (currentTime.getTime() + appointment_duration * 60 * 1000 < endTime.getTime()) {
      console.log(currentTime.toISOString())
      let dateString = currentTime.toISOString().slice(0, 19).replace('T', ' ');
      console.log(dateString)
      if (await func(dateString))
        return false

      // Increment the current time by 30 minutes
      currentTime.setMinutes(currentTime.getMinutes() + appointment_duration);
    }
    return true
  }

  const appointment_factory = (time) => {
    return new Appointment(
      id = undefined,
      req.query.patientid,
      req.query.doctorid,
      req.query.nurseid,
      time,
      '00:' + appointment_duration + ':00'
    )
  }
  
  const check_errors = async(time) => {
    let app = appointment_factory(time)
  
    if (await app.conflictsWithDb()){
      res.status(500).send('Appointment overlaps.')
      return true
    }
    else if (await app.isSavedToDb())
    {
      res.status(500).send('Appointment exists.')
      return true
    }
    return false
  }

  const save_to_db = async(time) => {
    console.log('making' + time)
    let app = appointment_factory(time)
    await app.saveToDb()
  }
  console.log('here')

  if (await loop_over_appointments(check_errors)){
    await loop_over_appointments(save_to_db)
    res.send("OK");
  }
});



/* 
these 6 are similar, they need identification information of an appointment in query
  time: string ("YYYY-MM-DD HH:MM:SS")
  doctorid or nurseid: int
*/

// when the patient chooses one of the available doctor or nurse appointments
// this is used to reserve it
// extra fields ->
//  type: string (type of an appointment ('vadenje krvi', ...))
router.post('/reserve', async function(req, res, next) {
  // TODO limit number of reserves
  update_app(req, res, (app)=>{
    app.patientid = req.query.patientid
    app.created_on = curr_date_factory()
    app.type = req.query.type
  })

  let doctor = await Doctor.getById(doctorId);
  notification.sendEmail("appointmentBooked", doctor.mail); //obavijesti doktora o rezervaciji termina
});

// if somebody needs to cancel an appointment
// the doctor or nurse slot is kept available, just the patient id is not linked to the appointment
router.post('/cancel', async function(req, res, next) {
  update_app(req, res, (app) => {
    app.patientid = undefined
    app.created_on = undefined
    app.pending_accept = undefined
    app.type = undefined
  })
});

// work in progress
router.post('/change', async function(req, res, next) {
  update_app(req, res, (app)=>{
    app.pending_accept = false
    app.created_on = curr_date_factory()
  } )
});

// if the doctor moves the appointment the patient has to accept
router.post('/accept_change', async function(req, res, next) {
  update_app(req, res, (app)=>{
    app.pending_accept = false
    app.created_on = curr_date_factory()
  })
  
});

// if the doctor moves the appointment the patient can reject
router.post('/reject_change', async function(req, res, next) {
  update_app(req, res, (app)=> {
    app.pending_accept = false
    app.patientid = undefined
  })
});

// at the end of the day nurse/doctor has to record did the patiend come
// to the appointment
// extra fields ->
//  patient_came: boolean
router.post('/record_attendance', async function(req, res, next) {
  update_app(req, res, (app)=>{
    app.patient_came = JSON.parse(req.query.patient_came)
  })
});



// delete one appointment with id = `id`
router.post('/delete', async function(req, res, next) {
  let app = new Appointment(
    id = req.query.id,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  )
  
  if (!app.isSavedToDb())
    res.status(500).send('Does not exist in the database.')
  else{
    app.removeFromDb()
    res.send("OK");
  }

});

notification.appointmentReminderEmail();

module.exports = router;
