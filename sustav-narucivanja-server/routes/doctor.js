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

// ovaj get ne radi
router.get("/get_rule", async function (req, res, next) {
    const result = await Doctor.getRule(req.session.user.id);
    res.json(result);
});

router.post("/set_rule", async function (req, res, next) {
    await Doctor.setRule(req.body.id, req.body.hours);
    res.json("success");
});
 
module.exports = router;