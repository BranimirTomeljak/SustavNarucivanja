var express = require('express');
const { rawListeners } = require('../app');
var Appointment = require('../models/AppointmentModel')

var router = express.Router();
const appointment_duration = 30;


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
    res.json({'error':'Appointment overlaps.'})
  else if (await app.isSavedToDb())
    res.json({'error':'Appointment exists.'})
  else {
    app.saveToDb()
    res.json({});
  }
});

// create appointment with `patientid`, nurse or doctor id 
// time and duration
router.post('/add_range', async function(req, res, next) {
  
  if ((req.query.doctorid===undefined) === (req.query.nurseid===undefined))
    throw 'cannot both be defined'
  
  const loop_over_appointments = async (func) => {
    // Parse the start and end times as Date objects
    const startTime = new Date(Date.parse(req.query.time_start));
    const endTime   = new Date(Date.parse(req.query.time_end));

    // Set the current time to the start time
    let currentTime = startTime;

    // Loop until the current time is past the end time
    while (currentTime.getTime() + appointment_duration * 60 * 1000 < endTime.getTime()) {
      console.log(currentTime.toISOString())
      if (await func(currentTime.toISOString()))
        return false

      // Increment the current time by 30 minutes
      currentTime.setMinutes(currentTime.getMinutes() + appointment_duration);
    }
    return true
  }

  const appointment_factory = (time) => {
    console.log('factoruyuuu')
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
      res.json({'error':'Appointment overlaps.'})
      return true
    }
    else if (await app.isSavedToDb())
    {
      res.json({'error':'Appointment exists.'})
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
    res.json({'error':'Does not exist in the database.'})
  else{
    app.removeFromDb()
    res.json({})
  }

});

module.exports = router;
