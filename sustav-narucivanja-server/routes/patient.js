var express = require('express');
//const { rawListeners } = require('../app');
var Appointment = require('../models/AppointmentModel');
const { Patient, Doctor } = require('../models/UserModel');

var router = express.Router();

// get all appointemnts from an `id` with `role`
router.get('/', checkNotAuthenticated, async function(req, res, next) {
  if (req.session.user.type === 'patient'){
    //let patient = await Patient.getById(req.session.user.id) //darijanovo
    //patient.password = undefined //darijanovo
    //res.json(patient); //darijanovo

    console.log(req.session);
    //let doctor = await Doctor.getById(req.session.user.doctorId);
    //let appointments = Appointment.fetchBy("patientId", req.session.user.id);
    //res.json(doctor);
    //console.log(appointments);
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
  if (other.id === undefined)
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
