var express = require('express');
//const { rawListeners } = require('../app');
var Appointment = require('../models/AppointmentModel');
var { Doctor } = require("../models/UserModel");

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
    res.json({'error':'Appointment overlaps.'})
  else if (await app.isSavedToDb())
    res.json({'error':'Appointment exists.'})
  else {
    app.saveToDb();
    sendAddAppointmentEmail(doctorId);
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

async function sendAddAppointmentEmail(doctorId){
  let doctor = await Doctor.getById(doctorId);

  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: "sustavzanarucivanje@outlook.com",
      pass: "Narucivanje1950"
    }
  });

  //todo napisat nesto posteno
  var message = `<p>Po&scaron;tovani ${doctor.name} ${doctor.surname},<br /><br />Rezerviran Vam je termin u ${time} i traje ${duration}</p><p>Lijep pozdrav</p>`;

  const options = {
    from: "sustavzanarucivanje@outlook.com",
    to: mail,
    subject: "Potvrda registracije na Sustav za naručivanje",
    //text: "bla bla tekst tekst",
    html: message
  };

  transporter.sendMail(options, function(err, info){
    if(err){
      console.log(err);
      return;
    }
    console.log("Send: " + info.response);
  })
}

module.exports = router;
