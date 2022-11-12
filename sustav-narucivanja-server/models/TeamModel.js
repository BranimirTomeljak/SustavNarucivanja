const db = require('../db')

class Team {
    //konstruktor korisnika
    constructor(
        teamName = undefined, 
        doctorid = undefined
    ) {
        this.teamName = teamName
        this.doctorid = doctorid
    }

    //dohvat tim na osnovu imena
    static async fetchByTeamName(teamName) {

        let results = await User.dbGetUserBy('teamName', teamName, 'team')
        let newTeam = new Team()

        if( results.length > 0 ) {
            newTeam = new Team(results[0].teamName, results[0].doctorid)
        }
        return newTeam
    }


    //je li je tim pohranjen u bazu podataka?
    isPersisted() {
        if (this.iteamNamed === undefined)
            return false
        t = Team.fetchByTeamName(this.teamName)
        return t.teamName !== undefined
    }


    async _checkIsIn(where){
        const sql = "SELECT * FROM " + where + " where teamName = " + this.teamName
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
    async saveTeamToDb(){
        if (this.teamName !== undefined)
            throw 'cannot have defined teamName and try to save the team'

        const sql = "INSERT INTO team (namteamName, doctorid) VALUES ('" +
            this.teamName + "', '" + this.doctorid + "',1) RETURNING teamName;" 

        const result = await db.query(sql, []);
        this.teamName = result[0].teamName
        return result
    }

    async _saveteamNameToDb(table){
        if (this.teamName !== undefined)
            throw 'cannot have defined teamName and try to save the team'
        const sql = "INSERT INTO " + table + " (teamName) VALUES ('" + this.teamName + " )";
        const result = await db.query(sql, []);
    }

    //umetanje zapisa o timu u bazu podataka
    async removeTeamFromDb(){
        if (this.teamName === undefined)
            throw 'cannot have defined teamName and try to save the team'

        const sql = "DELETE FROM team where teamName = " + this.teamName
        const result = await db.query(sql, []);
        this.teamName = undefined
        return result
    }

}



module.exports = {
    'Team' : Team
}


