var express = require("express");
var router = express.Router();
const { pool } = require("../db/dbConfig");
const passport = require("passport");
const flash = require("express-flash");
const { json } = require("express");
const { User, Patient, Doctor, Nurse, Admin } = require('../models/UserModel');

/*router.get("/", checkAuthenticated, (req, res) => {  //zasad nek stoji komentirano ali tribat ce nan posli (kad pokusavamo pristupit login pageu, a vec smo logirani)
  // flash sets a messages variable. passport sets the error message  
  console.log(req.session.flash.error);
  //res.render("login.ejs");
  res.sendStatus(401);
});*/

router.post( "/",
  passport.authenticate("local", { failureFlash: true }),
  async function (req, res) {
    console.log('hello')
    console.log(req.body)
    let { mail } = req.body;
    let user = await User.fetchBymail(mail)

    let id = user.id
    console.log(user)
    if (res.session === undefined)
      res.session = {}
    if (user.isPatient())
      res.session.user = await Patient.getById(id)
    else if (user.isDoctor())
      res.session.user = await Doctor.getById(id)
    else if (user.isNurse())
      res.session.user = await Nurse.getById(id)
    else if (user.isAdmin())
      res.session.user = await Admin.getById(id)
    res.json(res.session.user);

  }
);

/*function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("Logged in -> got another login request"); //nez sta ce nan ovo al aj
    return res.sendStatus(200);
  }
  next();
}*/

module.exports = router;
