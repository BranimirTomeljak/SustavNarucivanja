var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const { pool } = require("../db/dbConfig");
const flash = require("express-flash");
const { User, Patient } = require("../models/UserModel");

router.post("/", async (req, res) => {
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
    !doctorId
  ) {
    errors.push({ message: "Please enter all fields" });
    res.sendStatus(400);
    return
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
    res.sendStatus(400);
    return
  }

  if(phoneNumber?.length !== 9 || phoneNumber?.length !== 10) {
    errors.push({ message: "Croatian phone number must have 9 or 10 digits" });
    res.sendStatus(400);
    return
  }

  let user = await User.fetchBymail(mail)
  if (user !== undefined){
    errors.push({ message: "Email already registered" });
    res.sendStatus(400);
    return
  }

  user = await User.dbGetUserBy('phoneNumber', phoneNumber, 'user')
  if (user !== undefined){
    errors.push({ message: "Phone number already registered." });
    res.sendStatus(400);
    return
  }

  // actually add the person to the database
  hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);

  let patient = new Patient(
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
    res.sendStatus(200);
  }
  catch{
    res.sendStatus(400);
  }

});

module.exports = router;
