var express = require('express');
var router = express.Router();
const {Team} = require('../models/TeamModel');

/* GET users listing. */
router.get('/all', async function(req, res, next) {
    let teams = await Team.fetchAllTeams();
    res.json(teams);
});

router.post('/create', async function(req, res, next) {
    await Team.createTeam(req.body.name, req.body.doctorIds, req.body.nurseIds)
    res.json("Successfully created team")
});

router.post('/delete', function(req, res, next) {
    try{
        let team = new Team(req.body.teamId);
        console.log(team);
        team.removeTeamFromDb();
        res.status(200).json("Successfully deleted team");
    }
    catch{
        res.status(500).json("Error deleting team");
    }
});

router.post('/edit', function(req, res, next) {
    let team = new Team(req.body.teamId);
    let doctors = fetchAllDoctorsFromTeam(team);
    let nurses = fetchAllNursesFromTeam(team);

    for (let doctorId of doctors) {
        team.removeDoctorFromTeam(doctorId);
    }
    for(let nurseId of nurses) {
        team.removeNurseFromTeam(nurseId);
    }

    for (let doctorId of req.body.doctorIds) {
        team.addDoctorToTeam(doctorId);
    }
    for(let nurseId of req.body.nurseIds) {
        team.addNurseToTeam(nurseId);
    }
});

router.get('/:id', async function(req, res, next) {
    let team = await Team.fetchByTeamId(req.params.id);
    res.json(team);
});

module.exports = router;