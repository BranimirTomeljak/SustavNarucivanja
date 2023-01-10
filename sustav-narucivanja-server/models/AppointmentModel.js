const db = require('../db')
const add_hour = (date) => {date.setHours(date.getHours() + 1); return date;} 

const app_factory = (obj) =>{
    return new Appointment(
        obj.id, 
        obj.patientid, 
        obj.doctorid, 
        obj.nurseid, 
        obj.time, 
        obj.duration,
        obj.created_on,
        obj.changes_from,
        obj.type,
        obj.patient_came,
    )
}

class Appointment {
    //konstruktor korisnika
    constructor(
        id = undefined,
        patientid,
        doctorid=undefined, 
        nurseid=undefined, 
        time,
        duration,
        created_on=undefined,
        changes_from=undefined,
        type=undefined,
        patient_came=undefined,
    ) {
        this.id = id
        this.patientid = patientid, 
        this.time = time
        this.duration = duration
        this.doctorid = doctorid
        this.nurseid = nurseid
        this.created_on = created_on
        this.changes_from = changes_from
        this.type = type
        this.patient_came = patient_came
    }


    // for example can fetch by patientid, doctorid
    static async fetchBy(property, id) {

        let appointments = await Appointment.dbGetBy('appointment', property, id)
        let toreturn = []
        for (let app of appointments){
            app.time = add_hour(app.time)
            toreturn.push( app_factory(app))
        }
        return toreturn
    }

    // da li je appointment pohranjen u bazu podataka?
    async isSavedToDb() {
        if (this.id === undefined)
            return false
        let apps = await Appointment.fetchBy('id', this.id)
        return apps.length == 1
    }

    // dohvat korisnika iz baze podataka na osnovu `what` i `table` odakle uzimamo
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

        const sql = "INSERT INTO appointment (patientid, doctorid, nurseid, time, duration, created_on, changes_from, type, patient_came) VALUES (" +
            [
                f(this.patientid), 
                f(this.doctorid), 
                f(this.nurseid), 
                f(this.time), 
                f(this.duration), 
                f(this.created_on), 
                f(this.changes_from), 
                f(this.type),
                f(this.patient_came),
            ].join(" , ") + 
            ") RETURNING id;"

        console.log(sql)
        const result = await db.query(sql, []);
        console.log(result)
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

    static _stringify_all(a){
        if (a === undefined || a === null)
            return 'NULL'
        if (a.toISOString !== undefined)
            a = a.toISOString().slice(0, 19).replace('T', ' ');
        
        if (typeof a === "string")
            if (a.indexOf("-") > -1)
                return "'" + a + "'" + '::TIMESTAMP '
            else if (a.indexOf("P0Y0") > -1){
                a = a.split(' ')[1].replace(/[HM]/g, ":").replace('S', ''); 
                return "'" + a + "'" + '::INTERVAL '
            }
            else
                return "'" + a + "'"
        return a
    }

    async conflictsWithDb (){
        let beg = "('" + this.time + "'::timestamp)"
        let end = "(" + beg + "+ ('" + this.duration + "'::interval))"
        let constraint_list = []

        if (this.doctorid !== undefined)
            constraint_list.push("doctorid = " + this.doctorid)
        if (this.nurseid !== undefined)
            constraint_list.push("nurseid = " + this.nurseid)
        if (this.patientid !== undefined)
            constraint_list.push("patientid = " + this.patientid)

        let constraint_str = constraint_list.join(' or ')

        const sql = `
            SELECT * from appointment a
            where not (( a.time <= ` + beg + ` and a.time + a.duration <= `+beg+`) or
                       (`+beg+`<= a.time and `+ end + `<=a.time))
                    and (` + constraint_str +`) 
        `
        const result = await db.query(sql, []);
        if (result.length){
            console.log('conflicts')
            console.log(result, this.id, result.length, result.length>0)
        }

        if (this.id === undefined)
            return result.length > 0
        return result.length > 1
    }

    // for example can fetch by patientid, doctorid
    static async fetchBy2(propertya, ida, propertyb, idb) {
        let f = Appointment._stringify_all
        const sql = 'SELECT * FROM appointment WHERE ' + propertya + "=" + f(ida) + " and " + propertyb + "=" + f(idb);
        const appointments = await db.query(sql, []);
        console.log(appointments)
        let toreturn = []
        for (let app of appointments){
            app.time = add_hour(app.time)
            toreturn.push( app_factory(app))
        }
        return toreturn
    }

    // for example can fetch by patientid, doctorid
    async updateDb() {
        let f = Appointment._stringify_all
        console.log('updationg...')
        console.log(this.time)
        const sql = `UPDATE appointment 
                    SET patientid=` + f(this.patientid) + 
                    `, doctorid=` + f(this.doctorid) + 
                    `, nurseid=` + f(this.nurseid) + 
                    `, time=` + f(this.time) + 
                    ', duration=' + f(this.duration) + 
                    ', created_on=' + f(this.created_on) + 
                    ', changes_from=' + f(this.changes_from) + 
                    ', type=' + f(this.type) + 
                    ', patient_came=' + f(this.patient_came) + 
                    ` WHERE id=` + f(this.id);
        return await db.query(sql, []);
    }
}

    const cron = require('node-cron');
    const shell = require('shelljs');
    const xml2js = require('xml2js');
    const {
        sendEmail
     } = require('./NotificationModel');
    const { Patient, Doctor } = require('./UserModel');

    async function dailyLog(){
        const q1 = 'SELECT count(id) FROM appointment where DATE(time) = CURRENT_DATE - 1 ';
        const res1 = await db.query(q1, []);
        const q2 = 'SELECT count(id) FROM appointment where DATE(time) = CURRENT_DATE - 1 and patient_came';
        const res2 = await db.query(q1, []);
    
        var q3 = 'SELECT * FROM appointment'; // where DATE(time) = CURRENT_DATE - 1
        var q4 = 'SELECT count(id) FROM appointment'; //where id = 2222
        var res3 = await db.query(q3, []);
        var res4 = await db.query(q4, []);
        let zakazani = JSON.stringify(res1[0].count);
        let dosli = JSON.stringify(res2[0].count);
        dosli = dosli.substring(1, dosli.length - 1);
        zakazani = zakazani.substring(1, zakazani.length - 1);
        
        const obj = {
            root: {
    
                div: 'Dnevno izvješće o sastancima:',
            },
            body: {
                element1: 'U protekla 24 sata ukupno je zakazano ' + zakazani + ' sastanaka.',
                element2: 'Od toga se ' + dosli + ' pacijenata odazvalo na poziv.'
            },
            core: {
                div: 'Informacije o svim sastancima: ',
            },
            body1: {
    
            }
        };
    
      
        let numApp = JSON.stringify(res4[0].count);
        numApp = numApp.substring(1, numApp.length - 1);
        numApp = Number(numApp)
        if(numApp == 0){
            obj.core.child = 'Danas nije bilo rezerviranih niti obavljenih sastanaka.'
    
        } else {
            for(let i = 0; i < numApp; i++){
                obj.body1.div = i + 1 + '. sastanak';  
                let patient = await Patient.fetchById(res3[i].patientid)
                let doctor = await Doctor.fetchById(res3[i].doctorid)
                obj.body1.div1 = 'Pacijent: ' + patient.name + ' ' + patient.surname + ' (ID: ' + patient.id + ')';
                obj.body1.div2 = 'Doktor: ' + doctor.name + ' ' + doctor.surname + ' (ID: ' + doctor.id + ')';
                if(res3[i].nurseid === null){
    
                } else {
                    obj.body1.div3 = 'Medicinska sestra: ' + res1[i].nurseid;
                }
                obj.body1.div4 = 'Vrijeme sastanka: ' + res3[i].time;
                obj.body1.div6 = 'Trajanje sastanka: '+ res3[i].duration;
                if(res3[i].patient_came){
                      obj.body1.div5 = 'Je li pacijent došao na sastanak? Da';
                }else if (res3[i].patient_came == null)
                      obj.body1.div5 = 'Je li pacijent došao na sastanak? Nema informacija';
                else 
                      obj.body1.div5 = 'Je li pacijent došao na sastanak? Ne';
                
            }
        }
    
        const builder = new xml2js.Builder();
        let xml = builder.buildObject(obj);
        console.log(xml);
    }
    
    cron.schedule("0 0 0 * * *", async function () { // Daily report about reservations
        await dailyLog();
    })

    cron.schedule("* * 1 * *", async function () { // Daily report about reservations
        await dailyLog();
    })

module.exports = Appointment