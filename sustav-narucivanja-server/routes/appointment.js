var express = require('express');
//const { rawListeners } = require('../app');
var Appointment = require('../models/AppointmentModel')

var router = express.Router();


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
router.post('/add', async function(req, res, next) {
  if ((req.query.doctorId===undefined) === (req.query.nurseId===undefined))
    console.log("1");
    //throw 'cannot both be defined'

  let app = new Appointment(
    id = undefined,
    req.query.patientId,
    req.query.doctorId,
    req.query.nurseId,
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
