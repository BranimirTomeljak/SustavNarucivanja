var express = require("express");
var router = express.Router();
const passport = require("passport");
const { User, Patient, Doctor, Nurse, Admin } = require('../models/UserModel');

router.post( "/",
  passport.authenticate("local", { failureFlash: true }),
  async function (req, res) {
    let { mail } = req.body;
    let user = await User.fetchBymail(mail)

    let id = user.id
    if (req.session === undefined)
      req.session = {}
    if (await user.isPatient())
      req.session.user = await Patient.getById(id)
    else if (await user.isDoctor())
      req.session.user = await Doctor.getById(id)
    else if (await user.isNurse())
      req.session.user = await Nurse.getById(id)
    else if (await user.isAdmin())
      req.session.user = await Admin.getById(id)
    req.session.save()
    res.json(req.session.user);

  }
);

module.exports = router;
