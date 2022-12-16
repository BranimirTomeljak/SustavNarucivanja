var express = require('express');
const { rawListeners } = require('../app');
var Appointment = require('../models/AppointmentModel')

var router = express.Router();
const appointment_duration = 30;
const add_hour = (date) => {date.setHours(date.getHours() + 1); return date;} 
const curr_date_factory = ()=> {add_hour(new Date())}


// get all appointemnts from an `id` with `role`
router.get('/', async function(req, res, next) {
  let role = req.query.role
  let id   = req.query.id
  if (role == 'admin')
    throw 'no admin here'
  let field = {'doctor':'doctorid', 'patient':'patientid', 'nurse':'nurseid'}[role]
  let apps = await Appointment.fetchBy(field, id)
  res.json(apps);
});

// create appointment with `patientid`, nurse or doctor id 
// time and duration
router.post('/add', async function(req, res, next) {
  if ((req.query.doctorid===undefined) === (req.query.nurseid===undefined))
    throw 'cannot both be defined'

  let app = new Appointment(
    id = undefined,
    req.query.patientid,
    req.query.doctorid,
    req.query.nurseid,
    req.query.time,
    req.query.duration
  )

  if (await app.conflictsWithDb())
    res.status(500).send('Appointment overlaps.')
  else if (await app.isSavedToDb())
    res.status(500).send('Appointment exists.')
  else {
    app.saveToDb()
    res.send("OK");
  }
});

// create appointment with `patientid`, nurse or doctor id 
// time and duration
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
    res.json({});
  }
});


// create appointment with `patientid`, nurse or doctor id 
// time and duration
router.post('/reserve', async function(req, res, next) {
  await app_updater(req, res, "reserve")
});

router.post('/cancel', async function(req, res, next) {
  await app_updater(req, res, "cancel")
});

router.post('/accept_change', async function(req, res, next) {
  await app_updater(req, res, "accept_change")
});

router.post('/reject_change', async function(req, res, next) {
  await app_updater(req, res, "accept_change")
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



const app_updater = async (req, res, what) => {
  if ((req.query.doctorid===undefined) === (req.query.nurseid===undefined)){
    res.status(500).send('Only one of doctorid or nurseid can be defined')
    return
  }

  let app;
  const time   = add_hour(new Date(Date.parse(req.query.time)));

  if (req.query.doctorid !== undefined)
    app = await Appointment.fetchBy2("doctorid", req.query.doctorid, "time", time)
  else
    app = await Appointment.fetchBy2("nurseid", req.query.nurseid, "time", time)
  if (app.length === 0){
    res.status(500).send('There is no specified appointment slot')
    return
  }
  app = app[0]
  if (what === "reserve"){
    app.patientid = req.query.patientid
    app.created_on = curr_date_factory()
    app.type = req.query.type
  }
  else if (what === "cancel"){
    app.patientid = undefined
  }
  else if (what === "accept_change"){
    app.pending_accept = false
    app.created_on = curr_date_factory()
  }
  else if (what === "reject_change"){
    app.pending_accept = false
    app.patientid = undefined
  }


  await app.updateDb()
  res.send("OK");
}


module.exports = router;
