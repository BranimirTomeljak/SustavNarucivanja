var express = require("express");
var router = express.Router();
const { Team } = require("../models/TeamModel");

/* GET teams listing. */
router.get("/all", async function (req, res, next) {
  let teams = await Team.fetchAllTeams();
  res.json(teams);
});

router.post("/create", async function (req, res, next) {
  await Team.createTeam(req.body.name, req.body.doctorIds, req.body.nurseIds);
  res.json("Successfully created team");
});

router.delete("/delete/:id", function (req, res, next) {
  try {
    let team = new Team(req.params.id);
    team.removeTeamFromDb();
    res.status(200).json("Successfully deleted team");
  } catch {
    res.status(500).json("Error deleting team");
  }
});

router.post("/edit/:id", async function (req, res, next) {
  try {
    let team = new Team(req.params.id);
    let doctors = await Team.fetchAllDoctorsFromTeam(team.teamId);
    let nurses = await Team.fetchAllNursesFromTeam(team.teamId);

    for (let doctor of doctors) {
      await team.removeDoctorFromTeam(doctor.id);
    }
    for (let nurse of nurses) {
      await team.removeNurseFromTeam(nurse.id);
    }

    await team.changeTeamName(req.body.name);

    for (let doctorId of req.body.doctorIds) {
      await team.addDoctorToTeam(doctorId);
    }
    let ok = true;
    for (let nurseId of req.body.nurseIds) {
      ok = await team.addNurseToTeam(nurseId);
    }
    if (!ok)
      res.status(500).json("Nurse should have no future appointments");
    else
      res.status(200).json("Successfully edited team");
  } catch {
    res.status(500).json("Error editing team");
  }
});

router.get("/:id", async function (req, res, next) {
  let team = await Team.fetchByTeamId(req.params.id);
  res.json(team);
});

module.exports = router;
