var express = require('express');
const db = require('../db')
//const { rawListeners } = require('../app');
const notification = require("../models/NotificationModel");
var Appointment = require('../models/AppointmentModel');
var { Doctor, Patient } = require("../models/UserModel");
var { Team } = require("../models/TeamModel");

var router = express.Router();
const appointment_duration = 30;
const add_hour = (date) => {date.setHours(date.getHours() + 1); return date;} 
const curr_date_factory = ()=> {return add_hour(new Date())}

// IMPORTANT!!!!
// once we get the authentification and session working you will not need to send id and type


// get all appointemnts from an `id` with `type`
router.get('/', async function(req, res, next) {
  let type = req.query.type
  let id   = req.query.id
  if (type == 'admin')
    throw 'no admin here'
  let field = {'doctor':'doctorid', 'patient':'patientid', 'nurse':'nurseid'}[type]
  let apps = await Appointment.fetchBy(field, id)
  res.json(apps);
});

// get number of pending future appointements of logged in patient
router.get('/num_future_appointments', async function(req, res, next) {
  let id = req.session.user.id;
  var result = await Appointment.fetchNumOfFutureAppointments(id);
  res.json(result);
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
  const loop_over_appointments = async (func) => {
    // Parse the start and end times as Date objects
    const startTime = add_hour(new Date(Date.parse(req.body.time_start)));
    const endTime   = add_hour(new Date(Date.parse(req.body.time_end)));
    console.log(" OVO JE  ENDTIME: " + endTime)
    let date = new Date()
    console.log(" OVO JE DATE: " + date.getTime())
    const diff = Math.abs(endTime.getTime() - date.getTime())
    if (Math.ceil(diff / (1000 * 60 * 60 * 24)) > 10) {
      res.status(403).send("Moguce je definirati slobodne termine samo do 10 dana unaprijed.");
      return false;
    }

    // Set the current time to the start time
    let currentTime = startTime;

    // Loop until the current time is past the end time
    while (currentTime.getTime() + appointment_duration * 60 * 1000 <= endTime.getTime()) {
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

  const appointment_factory = (time, doctorid, nurseid) => {
    return new Appointment(
      undefined,
      undefined,
      doctorid,
      nurseid,
      time,
      '00:' + appointment_duration + ':00'
    )
  }
  
  const check_errors = async(app) => {  
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

  const multiply_appointment_over_team = async (time, func) => {
    let app = appointment_factory(time, req.session.user.id, undefined)
    let res = await func(app)
    let nurses = await Team.dbGetNursesByTeamId(req.session.user.teamid)
    for (let nurse of nurses){
      app = appointment_factory(time, undefined, nurse.id)
      res = res && await func(app)
    }
    return res
  }

  const save_to_db = async(app) => {
      await app.saveToDb()   
      return true 
  }
  console.log('here')

  if (await loop_over_appointments(async (time) => {await multiply_appointment_over_team(time, check_errors)})){
    await loop_over_appointments(async (time) => {await multiply_appointment_over_team(time, save_to_db)})
    res.json();
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
  app.patientid = req.session.user.id
  app.created_on = curr_date_factory()
  const date = new Date();
  const difference = Math.abs(app.time.getTime() - date.getTime())

  const sql = "SELECT appointmentRule FROM doctor WHERE id = " + app.doctorid;
  const results = await db.query(sql, []);
  console.log();
  
  if ( results[0].appointmentrule != undefined && (difference / (60*60*1000)) < results[0].appointmentrule) {
    res.status(403).send("Nije moguce ugovoriti pregled više od " + results[0].appointmentrule + " sati prije pocetka")
  }
  app.type = req.body.type
  await app.updateDb()

  //let doctor = await Doctor.getById(app.doctorid);
  //notification.sendEmail("appointmentReserved", doctor); //obavijesti doktora o rezervaciji termina
  //res.status(300).send("OK")
  res.json(app);
});

// if somebody needs to cancel an appointment
// the doctor or nurse slot is kept available, just the patient id is not linked to the appointment
// Args:
// id: appointment id
router.post('/cancel', async function(req, res, next) {
  app = (await Appointment.fetchBy('id', req.body.id))[0]

  if(((app.time.getTime() - new Date().getTime())/(60*60*1000)) < 24){
    res.status(403).send("Ne mozete otkazati pregled prije manje od 24 sata od pocetka termina.")
  } else {
    app.patientid = undefined
    app.created_on = undefined
    app.changes_from = undefined
    app.type = undefined
    await app.updateDb()
    //notification.sendEmail("appointmentCanceled", app)
    //res.status(300).send("OK")
    res.json(app)
  }
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

  let date = new Date()

  if(((app_from.created_on.getTime() - date.getTime())/(60*60*1000)) < 24)
    res.status(403).send("Ne mozete pomaknuti pregled do cijeg je pocetka manje od 24 sata.")
  
  else {
    app_to.changes_from = req.body.from_id
    app_to.patientid = app_from.patientid
    await app_to.updateDb()
    let patient = await Patient.getById(app_from.patientid);
    //notification.sendNotification(patient.notificationMethod, "appointmentChangeRequest", app_to);
    res.status(300).send("OK")
  }
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
  //notification.sendEmail("appointmentChangeAccept", app_to);
  //res.status(300).send("OK")
  res.json();
});

// if the doctor moves the appointment the patient can reject
// Args:
// to_id:   id of appointment to which we are changing
router.post('/reject_change', async function(req, res, next) {
  app_to = (await Appointment.fetchBy('id', req.body.to_id))[0]
  app_to.changes_from = undefined
  app_to.patientid = undefined
  await app_to.updateDb()
  notification.sendEmail("appointmentChangeReject", app_to);
  //res.status(300).send("OK")
  res.json();
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
  res.json(app);
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
    //res.status(300).send("OK");
    res.json();
  }

});


notification.appointmentReminderEmail();

module.exports = router;
