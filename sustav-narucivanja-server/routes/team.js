var express = require('express');
var router = express.Router();
const {Team} = require('../models/TeamModel');

/* GET users listing. */
router.get('/all', async function(req, res, next) {
    let teams = await Team.fetchAllTeams();
    res.json(teams);
    
});

router.post('/create', async function(req, res, next) {
    let team = await Team.createTeam(undefined, req.body.name);

    for (let doctorId in req.body.doctorIds) {
        team.addDoctorToTeam(doctorId);
    }
    for(let nurseId in req.body.nurseIds) {
        team.addNurseToTeam(nurseId);
    }
});

router.post('/delete', function(req, res, next) {
    let team = new Team(req.body.teamId);
    team.removeTeamFromDb();
});

router.post('/edit', function(req, res, next) {
    let team = new Team(req.body.teamId);
    let doctors = fetchAllDoctorsFromTeam(team);
    let nurses = fetchAllNursesFromTeam(team);

    for (let doctorId in doctors) {
        team.removeDoctorFromTeam(doctorId);
    }
    for(let nurseId in nurses) {
        team.removeNurseFromTeam(nurseId);
    }

    for (let doctorId in req.body.doctorIds) {
        team.addDoctorToTeam(doctorId);
    }
    for(let nurseId in req.body.nurseIds) {
        team.addNurseToTeam(nurseId);
    }
    
});

module.exports = router;
