var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const { pool } = require("../db/dbConfig");
const flash = require("express-flash");
const { User, Patient, Doctor, Nurse, Admin } = require("../models/UserModel");

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

  let patient = new where(
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
    patient.addToDb()
    res.json(patient);
  }
  catch{
    res.sendStatus(400);
  }
}

module.exports = router;
