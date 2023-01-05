var express = require('express');
//const { rawListeners } = require('../app');
const notification = require("../models/NotificationModel");
var Appointment = require('../models/AppointmentModel');
var { Doctor } = require("../models/UserModel");

var router = express.Router();
const appointment_duration = 30;
const add_hour = (date) => {date.setHours(date.getHours() + 1); return date;} 
const curr_date_factory = ()=> {return add_hour(new Date())}

// IMPORTANT!!!!
// once we get the authentification and session working you will not need to send id and type


// get all appointemnts from an `id` with `type`
router.get('/', async function(req, res, next) {
  let type = req.session.user.type
  let id   = req.session.user.id
  if (type == 'admin')
    throw 'no admin here'
  let field = {'doctor':'doctorid', 'patient':'patientid', 'nurse':'nurseid'}[type]
  let apps = await Appointment.fetchBy(field, id)
  res.json(apps);
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
  if ((req.body.doctorid===undefined) === (req.body.nurseid===undefined))
    throw 'cannot both be defined'

  console.log('the date is ' + req.body.time_start )
  
  const loop_over_appointments = async (func) => {
    // Parse the start and end times as Date objects
    const startTime = add_hour(add_hour(new Date(Date.parse(req.body.time_start))));
    const endTime   = add_hour(add_hour(new Date(Date.parse(req.body.time_end))));

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
      req.body.patientid,
      req.body.doctorid,
      req.body.nurseid,
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
    res.status(300).send("OK");
  }
});



/* 
these 6 are similar, they need identification information of an appointment in body
*/

// when the patient chooses one of the available doctor or nurse appointments
// this is used to reserve it
// Args:
//  type: string (type of an appointment ('vadenje krvi', ...))
//  id: appointment id
router.post('/reserve', async function(req, res, next) {
  // TODO limit number of reserves
  app = (await Appointment.fetchBy('id', req.body.id))[0]
  app.patientid = req.body.patientid
  app.created_on = curr_date_factory()
  app.type = req.body.type
  await app.updateDb()

  let doctor = await Doctor.getById(app.doctorid);  //dobavit pravi doctor id
  notification.sendEmail("appointmentBooked", doctor.mail); //obavijesti doktora o rezervaciji termina
  res.status(300).send("OK")
});

// if somebody needs to cancel an appointment
// the doctor or nurse slot is kept available, just the patient id is not linked to the appointment
// Args:
// id: appointment id
router.post('/cancel', async function(req, res, next) {
  app = (await Appointment.fetchBy('id', req.body.id))[0]
  app.patientid = undefined
  app.created_on = undefined
  app.changes_from = undefined
  app.type = undefined
  await app_to.updateDb()
  res.status(300).send("OK")
});

// so doctor can change the appointment of the patient
// it can be decomposed in canceling the appointment and then reserving
// a new one 
// Args:
// from_id: id of appointment from which we are changing
// to_id:   id of appointment to which we are changing
router.post('/change', async function(req, res, next) {
  app_from = (await Appointment.fetchBy('id', req.body.from_id))[0]
  app_to   = (await Appointment.fetchBy('id', req.body.to_id))[0]
  app_to.changes_from = req.body.from_id
  app_to.patientid = app_from.patientid
  await app_to.updateDb()
  res.status(300).send("OK")
});

// if the doctor moves the appointment the patient has to accept
// Args:
// to_id:   id of appointment to which we are changing
router.post('/accept_change', async function(req, res, next) {
  app_to   = (await Appointment.fetchBy('id', req.body.to_id))[0]
  app_from = (await Appointment.fetchBy('id', app_to.changes_from))[0]
  app_to.changes_from = undefined
  app_to.created_on = curr_date_factory()  
  app_from.patientid = undefined
  app_from.created_on = undefined
  app_from.changes_from = undefined
  app_from.type = undefined
  await app_to.updateDb()
  await app_from.updateDb()
  res.status(300).send("OK")
});

// if the doctor moves the appointment the patient can reject
// Args:
// to_id:   id of appointment to which we are changing
router.post('/reject_change', async function(req, res, next) {
  app_to = (await Appointment.fetchBy('id', req.body.to_id))[0]
  app_to.changes_from = undefined
  app_to.patientid = undefined
  await app_to.updateDb()
  res.status(300).send("OK")
});

// at the end of the day nurse/doctor has to record did the patiend come
// to the appointment
// Args:
//  id: appointment id
//  patient_came: boolean
router.post('/record_attendance', async function(req, res, next) {
  app = (await Appointment.fetchBy('id', req.body.id))[0]
  app.patient_came = JSON.parse(req.body.patient_came)
  await app.updateDb()
  res.status(300).send("OK")
});



// delete one appointment with id = `id`
// Args:
// id:   id of appointment to which we are deleting
router.post('/delete', async function(req, res, next) {
  let app = new Appointment(
    id = req.body.id,
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
    res.status(300).send("OK");
  }

});


notification.appointmentReminderEmail();

module.exports = router;
