var express = require('express');
var Appointment = require('../models/AppointmentModel');
const { Patient, Doctor } = require('../models/UserModel');

var router = express.Router();

// get all appointemnts from an `id` with `type`
router.get('/', checkNotAuthenticated, async function(req, res, next) {
  if (req.session.user.type === 'patient'){
    //let patient = await Patient.getById(req.session.user.id)  //darijanovo
    //patient.password = undefined                              //darijanovo
    //res.json(patient);                                        //darijanovo

    let doctor = await Doctor.getNameSurnameById(req.session.user.doctorid);
    let appointments = Appointment.fetchBy("patientid", req.session.user.id);
    /*let randomArrayLikeAppointments = await Doctor.getIdNameSurnameOfAll();
    const merged = { //samo primjer zasad, vjv nece bit ovako
      ...doctor,
      ...randomArrayLikeAppointments
    };*/
    res.json(appointments);
  }
  else
    res.sendStatus(404);
});

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
}


module.exports = router;
