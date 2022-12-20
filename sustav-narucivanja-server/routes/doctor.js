var express = require('express');
var router = express.Router();
const { Doctor } = require("../models/UserModel");

/* GET users listing. */
router.get("/all", async function (req, res) {
    let doctors = await Doctor.getIdNameSurnameOfAll();
    res.json(doctors);
});

module.exports = router;