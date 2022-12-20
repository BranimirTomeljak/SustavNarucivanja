const db = require('../db')

class Team {
    //konstruktor tima
    constructor(
        teamId = undefined
    ) {
        this.teamId = teamId
    }

    //dohvat tim na osnovu imena
    static async fetchByTeamId(teamId) {

        let results = await Team.dbGetTeamBy('teamId', teamId, 'team')
        let newTeam = new Team()

        if( results.length > 0 ) {
            newTeam = new Team(results[0].teamId)
        }
        return newTeam
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
        const sql = 'SELECT * FROM ' + table + ' WHERE ' + what + ' = ' + that;
        const result = await db.query(sql, []);
        console.log('result is', result, table, what, that)
        return result;
    }

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

        const sql2 = "UPDATE FROM doctor SET teamId = NULL WHERE teamId = " + this.teamId
        const result2 = await db.query(sql2, []);
        const sql3 = "UPDATE FROM nurse SET teamId = NULL WHERE teamId = " + this.teamId
        const result3 = await db.query(sql3, []);

        const sql = "DELETE FROM team where teamId = " + this.teamId
        const result = await db.query(sql, []);

        this.teamId = undefined
        return result
    }

    async addDoctorToTeam(doctor) {
        if (this.teamId === undefined)
            throw 'cannot have undefined teamId and try to add the doctor to the team'
        const sql = "INSERT INTO doctor(teamId) VALUES("+this.teamId +") WHERE doctorid = " + doctor;
        const result = await db.query(sql, []);
    }
    async addNurseToTeam(nurse) {
        if (this.teamId === undefined)
            throw 'cannot have undefined teamId and try to add the nurse to the team'
        const sql = "INSERT INTO nurse(teamId) VALUES(" + this.teamId + ") WHERE nurseId = " + nurse;
        const result = await db.query(sql, []);
    }

    async removeDoctorFromTeam(doctor) {
        if (this.teamId === undefined)
            throw 'cannot have undefined teamId and try to remove the doctor to the team'
            
        const sql = "UPDATE doctor SET teamId = NULL WHERE doctorId = " + doctor
        const result = await db.query(sql, []);
    
        return result
        }

        async removeNurseFromTeam(nurse) {
            if (this.teamId === undefined)
                throw 'cannot have undefined teamId and try to remove the nurse to the team'
                
            const sql = "UPDATE nurse SET teamId = NULL WHERE nurseId = " + nurse
            const result = await db.query(sql, []);
        
            return result
            }
}



module.exports = {
    'Team' : Team
}
