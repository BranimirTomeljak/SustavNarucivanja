var express = require("express");
var router = express.Router();
const { Patient, Nurse } = require("../models/UserModel");

router.get("/", async function (req, res, next) {
  res.json(req.session.user);
});

router.get("/doctor", async function (req, res, next) {
  const id = req.session.user.id;
  const result = await Patient.getDoctorId(id);

  res.json(result);
});

router.get("/nurse", async function (req, res, next) {
  const id = req.session.user.id;
  const result = await Patient.getNurseId(id);

  res.json(result);
});

router.get("/nurse/teamId", async function (req, res, next) {
  const id = req.session.user.id;
  const result = await Nurse.getTeamId(id);

  res.json(result);
});

router.get("/nfailed", async function (req, res, next) {
  const id = req.session.user.id;
  const result = await Patient.getFailedAppointments(id);

  res.json(result);
});

module.exports = router;
