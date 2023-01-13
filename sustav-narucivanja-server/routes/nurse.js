var express = require('express');
var router = express.Router();
const { Nurse } = require("../models/UserModel");

/* GET nurses listing. */
router.get("/all", async function (req, res) {
    let nurses = await Nurse.getIdNameSurnameOfAll();
    res.json(nurses);
});

router.get("/:id", async function (req, res) {
    let nurse = await Nurse.getById(req.params.id);
    res.json(nurse);
});

module.exports = router;