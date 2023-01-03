var express = require('express');
var router = express.Router();
const { Doctor } = require("../models/UserModel");

/* GET users listing. */
router.get("/all", async function (req, res) {
    let doctors = await Doctor.getIdNameSurnameOfAll();
    res.json(doctors);
});

router.get("/:id", async function (req, res) {
    let doctor = await Doctor.getById(req.params.id);
    res.json(doctor);
});

module.exports = router;