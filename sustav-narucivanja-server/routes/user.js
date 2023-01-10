var express = require("express");
var router = express.Router();
const { User, Patient, Doctor, Nurse, Admin } = require("../models/UserModel");

router.get("/", async function (req, res, next) {
  res.json(req.session.user);
});

router.get("/doctor", async function (req, res, next) {
  const id = req.session.user.id;
  const result = await Patient.getDoctorId(id);

  res.json(result);
});

module.exports = router;