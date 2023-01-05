const db = require('../db')

class Team {
    //konstruktor tima
    constructor(
        teamId = undefined,
        name = undefined
    ) {
        this.teamId = teamId
        this.name = name
    }

    //dohvat tim na osnovu imena
    static async fetchByTeamId(teamId) {
        let result = await Team.dbGetTeamBy('teamid', teamId, 'team');
        const doctors = await Team.dbGetDoctorsByTeamId(teamId);
        const nurses = await Team.dbGetNursesByTeamId(teamId);
    
        let data = {
            teamId: teamId,
            name: result[0].name,
            doctors: [],
            nurses: []
        };

        for (let doctor of doctors) {
            data.doctors.push({
                id: doctor.id,
                name: doctor.name,
                surname: doctor.surname
            });
        }

        for (let nurse of nurses) {
            data.nurses.push({
                id: nurse.id,
                name: nurse.name,
                surname: nurse.surname
            });
        }

        if( result.length > 0 ) {
            return data;
        }
        return undefined;
    }

    static async dbGetDoctorsByTeamId(teamId) {
        const sqlDoctors = `SELECT id, name, surname FROM doctor NATURAL JOIN users WHERE teamId = ${teamId}`;
        const doctors = await db.query(sqlDoctors, []);
        console.log('doctors', doctors)
        return doctors;
    }

    static async dbGetNursesByTeamId(teamId) {
        const sqlNurses = `SELECT id, name, surname FROM nurse NATURAL JOIN users WHERE teamId = ${teamId}`;
        const nurses = await db.query(sqlNurses, []);
        return nurses;
    }

    static async createTeam(name, doctorIds, nurseIds)  {
        const sql = `INSERT INTO team (name) VALUES ('${name}') RETURNING teamid`;
        const result = await db.query(sql, []);
        let broj = result[0].teamid
        let team = new Team(broj, name);
        for (let doctorId of doctorIds) {
            team.addDoctorToTeam(doctorId);
        }
        for(let nurseId of nurseIds) {
            team.addNurseToTeam(nurseId);
        }
        return team;
    }


    static async fetchAllTeams() {

        const sql = 'SELECT * FROM team';
        const result = await db.query(sql, []);
        console.log('result is', result)
        return result;
    }

    static async fetchAllDoctorsFromTeam(team) {
        const sql = 'SELECT * FROM doctor WHERE teamId = ' + team;
        const result = await db.query(sql, []);
        console.log('result is', result)
        return result;
    }

    static async fetchAllNursesFromTeam(team) {
        const sql = 'SELECT * FROM nurse WHERE teamId = ' + team;
        const result = await db.query(sql, []);
        console.log('result is', result)
        return result;
    }

    //je li je tim pohranjen u bazu podataka?
    isPersisted() {
        if (this.teamId === undefined)
            return false
        t = Team.fetchByTeamId(this.teamId)
        return t.teamId !== undefined
    }


    async _checkIsIn(where){
        const sql = "SELECT * FROM " + where + " where teamId = " + this.teamId
        const result = await db.query(sql, []);
        return result.rows.length > 0;
    }


    //dohvat tima iz baze podataka na osnovu `what` i `table` odakle uzimamo
    static async dbGetTeamBy(what, that, table){
        console.log("Usli");
        const sql = 'SELECT * FROM ' + table + ' WHERE ' + what + ' = ' + that;
        const result = await db.query(sql, []);
        console.log('result is', result, table, what, that)
        return result;
    }

    static async

    //umetanje zapisa o timu u bazu podataka
    async _saveTeamIdToDb(table){
        if (this.teamId !== undefined)
            throw 'cannot have undefined teamId and try to save the team'
        const sql = "INSERT INTO " + table + " (teamId) VALUES ('" + this.teamId + " )";
        const result = await db.query(sql, []);
    }

    //brisanje zapisa o timu u bazu podataka
    async removeTeamFromDb(){
        if (this.teamId === undefined)
            throw 'cannot have defined teamId and try to save the team'

        const sql = `UPDATE doctor SET teamId = NULL WHERE teamId = ${this.teamId};UPDATE nurse SET teamId = NULL WHERE teamId = ${this.teamId};DELETE FROM team where teamId = ${this.teamId}`
        const result = await db.query(sql, []);

        this.teamId = undefined
        return result
    }

    async addDoctorToTeam(doctor) {
        if (this.teamId === undefined)
            throw 'cannot have undefined teamId and try to add the doctor to the team'
        const sql = `UPDATE doctor SET teamid = ${this.teamId} WHERE id = ${doctor}`;
        const result = await db.query(sql, []);
    }
    async addNurseToTeam(nurse) {
        if (this.teamId === undefined)
            throw 'cannot have undefined teamId and try to add the nurse to the team'
        const sql = `UPDATE nurse SET teamid = ${this.teamId} WHERE id = ${nurse}`;
        const result = await db.query(sql, []);
    }

    async removeDoctorFromTeam(doctor) {
        if (this.teamId === undefined)
            throw 'cannot have undefined teamId and try to remove the doctor to the team'
            
        const sql = "UPDATE doctor SET teamId = NULL WHERE id = " + doctor
        const result = await db.query(sql, []);
    
        return result
        }

    async removeNurseFromTeam(nurse) {
        if (this.teamId === undefined)
            throw 'cannot have undefined teamId and try to remove the nurse to the team'
                
        const sql = "UPDATE nurse SET teamId = NULL WHERE id = " + nurse
        const result = await db.query(sql, []);
        
        return result
    }

    async changeTeamName(newName) {
        if (this.teamId === undefined) 
            throw 'can not change team name if team does not exist'
        const sql = `UPDATE team SET name = '${newName}' WHERE id = ${this.teamId}}`
        const result = await db.query(sql, []);
        return
    }
}



module.exports = {
    'Team' : Team
}
