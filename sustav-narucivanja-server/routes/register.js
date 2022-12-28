var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const { pool } = require("../db/dbConfig");
const flash = require("express-flash");
const notification = require("../models/NotificationModel");
const { User, Patient, Doctor, Nurse, Admin } = require("../models/UserModel");

router.get("/doctors", async function (req, res) {
  let doctors = await Doctor.getIdNameSurnameOfAll();
  res.json(doctors);
});
router.get("/nurses", async function (req, res) {
  let nurses = await Nurse.getIdNameSurnameOfAll();
  res.json(nurses);
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
  notificationMethod: string (only for patient ("/"))

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
    notificationMethod
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
    notificationMethod
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
    (!doctorId && where===Patient) ||
    (!notificationMethod && where===Patient)
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
    notificationMethod,
    0
  )
  try{
    person.addToDb();
    //notification.sendNotification("mail", "registration", mail, phoneNumber); //(notificationMethod, purpose, mail, phoneNumber)
    //notification.sendNotification(notificationMethod, "registration", mail, phoneNumber); //kad dobijemo notificationMethod u body-u
    res.json(person);
  }
  catch{
    res.sendStatus(400);
  }
  return person
}

module.exports = router;