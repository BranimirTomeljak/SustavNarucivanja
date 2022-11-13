const db = require('../db')

class Appointment {
    //konstruktor korisnika
    constructor(
        id = undefined,
        patientid,
        doctorid=undefined, 
        nurseid=undefined, 
        time,
        duration,
    ) {
        this.id = id
        this.patientid = patientid, 
        this.time = time
        this.duration = duration
        this.doctorid = doctorid
        this.nurseid = nurseid
    }


    // for example can fetch by patientid, doctorid
    static async fetchBy(property, id) {

        let appointments = await Appointment.dbGetBy('appointment', property, id)
        let toreturn = []
        for (let app of appointments){
            toreturn.push( new Appointment(app.id, app.patientid, app.doctorid, app.nurseid, app.time, app.duration))
        }
        return toreturn
    }

    //da li je appointment pohranjen u bazu podataka?
    async isSavedToDb() {
        if (this.id === undefined)
            return false
        let apps = await Appointment.fetchBy('id', this.id)
        return apps.length == 1
    }

    //dohvat korisnika iz baze podataka na osnovu `what` i `table` odakle uzimamo
    // to moze biti doctor, nurse, admin, patient...
    static async dbGetBy(table, what, that){
        const sql = 'SELECT * FROM ' + table + ' WHERE ' + what + ' = ' + that;
        const result = await db.query(sql, []);
        return result;
    }

    //umetanje zapisa o korisniku u bazu podataka
    async saveToDb(){
        if (this.id !== undefined)
            throw 'cannot have defined id and try to save the user'

        const f = this._stringify

        const sql = "INSERT INTO appointment (patientid, doctorid, nurseid, time, duration) VALUES (" +
            [f(this.patientid), f(this.doctorid), f(this.nurseid), f(this.time), f(this.duration)].join(" , ") + 
            ") RETURNING id;"

        const result = await db.query(sql, []);
        this.id = result[0].id
        return result
    }

    //umetanje zapisa o korisniku u bazu podataka
    async removeFromDb(){
        if (this.id === undefined)
            throw 'cannot have defined id and try to save the user'

        const sql = "DELETE FROM appointment where id = " + this.id
        const result = await db.query(sql, []);
        this.id = undefined
        return result
    }

    _stringify(a){
        if (a === undefined)
            return 'NULL'
        return "'" + a + "'"
    }

    async conflictsWithDb (){
        let beg = "('" + this.time + "'::timestamp)"
        let end = "(" + beg + "+ ('" + this.duration + "'::interval))"

        const sql = `
            SELECT * from appointment a
            where not (( a.time <= ` + beg + ` and a.time + a.duration <= `+beg+`) or
                       (`+beg+`<= a.time and `+ end + `<=a.time))
                    and (patientid = `  + this.patientid + ` or doctorid = ` + this.doctorid +`) 
        `
        const result = await db.query(sql, []);
        if (result.length){
            console.log('conflicts')
            console.log(result, this.id, result.length, result.length>0)
        }

        if (this.id !== undefined)
            return result.length > 0
        return result.length > 1
    }

}

module.exports = Appointment


async function test(){
    // razred User enkapsulira korisnika web trgovine
    let print_all = async () => {
        let sql = "SELECT * FROM appointment"
        console.log('selecting from db...')
        let result = await db.query(sql, []);
        console.log(result)
    }

    await print_all()


    console.log('fetchung ones with doctorid=7')
    u = await Appointment.fetchBy('doctorid', 7)
    console.log(u)

    u = new Appointment(
        id = undefined,
        patientid=102,
        doctorid=7,
        nurseid=undefined,
        time= '2015-01-10 23:52:14',
        duration= '00:10:00'
    )
    
    console.log('insertion...')
    console.log(u)
    await u.saveToDb()
    await print_all()

    console.log('conflicts?')
    let yon = await u.conflictsWithDb()
    console.log(yon)



    console.log('deletion...')
    await u.removeFromDb()
    yon = await u.conflictsWithDb()
    console.log(yon)

    await print_all()

    // if you want to delete all from something
    // console.log('deletion...')
    // us = await Appointment.fetchBy('doctorid', 7)
    // for (u of us)
    //     await u.removeFromDb()
    // await print_all()


}

// test()

