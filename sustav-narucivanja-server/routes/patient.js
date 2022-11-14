var express = require('express');
const { rawListeners } = require('../app');
var Appointment = require('../models/AppointmentModel');
const { Patient } = require('../models/UserModel');

var router = express.Router();

// get all appointemnts from an `id` with `role`
router.get('/', checkNotAuthenticated, async function(req, res, next) {
  if (req.session.user.type === 'patient'){
    let patient = await Patient.getById(id)
    patient.password = undefined
    res.json(patient);
  }
  else
    res.sendStatus(404);
});

// create appointment with `patientid`, nurse or doctor id 
// time and duration
// ovo je example usage koji opisuje kako radi patient 
// i trebalo bi se nadogradit s braninin
router.post('/add', async function(req, res, next) {

  let patient = new Patient(
    id = undefined,
    req.query.name,
    req.query.surname,
    req.query.sex,
    req.query.phoneNumber,
    req.query.mail,
    req.query.password,
    req.query.dateOfBirth,
    req.query.doctorId,
    req.query.nFailedAppointments,
  )
  let other = await Patient.fetchBymail(req.query.mail)
  if (other.id)
    res.json({'error':'patient exists.'})
  else {
    patient.addToDb()
    res.json({'sucess':true});
  }
});

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
}


module.exports = router;
