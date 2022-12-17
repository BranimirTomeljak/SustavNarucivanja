var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const { pool } = require("../db/dbConfig");
const flash = require("express-flash");
const nodemailer = require("nodemailer");
const { User, Patient, Doctor, Nurse, Admin } = require("../models/UserModel");

router.get("/", async function (req, res) {
  let doctors = await Doctor.getIdNameSurnameOfAll();
  res.json(doctors);
});

/*
The following 4 endpoints are accesed in the same way.
The body encoded in a x-www-form-urlencoded way has to have:
  (key: value type):
  name: string
  surname: string
  sex: 'M' or 'F'
  phoneNumber: string (9 or 10 chars)
  mail: string, *@*.* (has to be unique)
  password: string
  dateOfBirth: string (YYYY-MM-DD)
  doctorId: int (only for patient ("/"))

If everything is ok you get OK you get 200 else error msgs
*/
router.post("/", async (req, res) => {
  await check_and_put(req, res, Patient)
});

router.post("/doctor", async (req, res) => {
  await check_and_put(req, res, Doctor)
});

router.post("/nurse", async (req, res) => {
  await check_and_put(req, res, Nurse)
});

router.post("/admin", async (req, res) => {
  await check_and_put(req, res, Admin)
});


const check_and_put = async (req, res, where) =>{
  let {
    name,
    surname,
    sex,
    phoneNumber,
    mail,
    password,
    dateOfBirth,
    doctorId,
  } = req.body;

  let errors = [];

  console.log({
    name,
    surname,
    sex,
    phoneNumber,
    mail,
    password,
    dateOfBirth,
    doctorId,
  });

  // check for errors
  if (
    !name ||
    !surname ||
    !sex ||
    !phoneNumber ||
    !mail ||
    !password ||
    !dateOfBirth ||
    (!doctorId && where===Patient)
  ) {
    errors.push({ message: "Please enter all fields" });
    console.log('enter all fields')
    res.sendStatus(400);
    return
  }

  if (password?.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
    console.log('to short password')
    res.sendStatus(400);
    return
  }

  if(phoneNumber?.length !== 9 && phoneNumber?.length !== 10) {
    errors.push({ message: "Croatian phone number must have 9 or 10 digits" });
    console.log('wrong phone num len')
    console.log(phoneNumber?.length)
    res.sendStatus(400);
    return
  }

  let user = await User.fetchBymail(mail)
  console.log(user)
  if (user !== undefined){
    errors.push({ message: "Email already registered" });
    console.log('email already registered')
    res.sendStatus(400);
    return
  }

  user = await User.dbGetUserBy('phoneNumber', "'"+phoneNumber+"'", 'users')
  console.log(user)

  if (user.length > 0){
    errors.push({ message: "Phone number already registered." });
    console.log('phone number already registered')
    res.sendStatus(400);
    return
  }
  
  console.log('all passed going to register')
  // actually add the person to the database
  hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);

  let person = new where(
    undefined,
    name,
    surname,
    sex,
    phoneNumber,
    mail,
    hashedPassword,
    dateOfBirth,
    doctorId,
    0
  )
  try{
    person.addToDb()
    sendRegisterEmail(mail);
    res.json(person);
  }
  catch{
    res.sendStatus(400);
  }
  return person
}

function sendRegisterEmail(mail){
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: "sustavzanarucivanje@outlook.com",
      pass: "Narucivanje1950"
    }
  });

  //todo napisat nesto posteno
  var message = `<p>Po&scaron;tovani,<br /><br />Uspje&scaron;no ste se registrirali na Sustav za naručivanje.<br /><br />Lijep pozdrav, Va&scaron; Sustav za naručivanje<br /><br />P.S. krindžaraa te&scaron;ka</p>`;

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