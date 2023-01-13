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
  phoneNumber: string (9 or 10 chars) (has to be unique)
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
    notificationMethod,
  } = req.body;

  let errors = [];

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
    res.sendStatus(400);
    return
  }

  if (password?.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
    res.sendStatus(400);
    return
  }

  if(phoneNumber?.length !== 9 && phoneNumber?.length !== 10) {
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

  user = await User.dbGetUserBy('phoneNumber', "'"+phoneNumber+"'", 'users')
  if (user.length > 0){
    errors.push({ message: "Phone number already registered." });
    res.sendStatus(400);
    return
  }
  
  // actually add the person to the database
  hashedPassword = await bcrypt.hash(password, 10);

  let person = new where(
    undefined,
    name,
    surname,
    sex,
    phoneNumber,
    mail,
    hashedPassword,
    dateOfBirth,
    {
      // TODO
      // this is very important, the frontent uses 'doctorId' while database uses 'doctorid'
      doctorid:doctorId,
      notificationMethod:notificationMethod,
      nFailedAppointments:0,
    },
  )
  try{
    await person.addToDb();
    //notification.sendNotification(notificationMethod, "registration", person);
    res.json(person);
  }
  catch{
    console.log("problem with saving, going to rm")
    try{
      await person.removeUserFromDb()
    }
    catch{
      console.log('could not rm from db')
    }
    res.sendStatus(400);
  }
  return person
}

module.exports = router;
