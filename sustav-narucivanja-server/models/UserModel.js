const db = require('../db')

function _stringify(a){
    if (a === undefined)
        return 'NULL'
    return a
}

class User {
    //konstruktor korisnika
    constructor(
        id=undefined, 
        name=undefined, 
        surname=undefined, 
        sex=undefined, 
        phonenumber=undefined, 
        mail=undefined, 
        password=undefined, 
        dateofbirth=undefined
    ) {
        this.id = id
        this.name = name
        this.surname = surname
        this.sex = sex
        this.phonenumber = phonenumber
        this.mail = mail
        this.password = password
        this.dateofbirth = dateofbirth
    }

    //dohvat korisnika na osnovu mail adrese
    static async fetchBymail(mail) {
        mail = "'" + mail + "'"
        let results = await User.dbGetUserBy('mail', mail, 'users')
        let newUser = undefined

        if( results.length > 0 ) {
            newUser = new User(results[0].id, results[0].name, results[0].surname,
                results[0].sex, results[0].phonenumber, results[0].mail, results[0].password, results[0].dateofbirth)
        }
        return newUser
    }

    //dohvat korisnika na osnovu id korisnika (tablica users)
    static async fetchById(id) {

        let results = await User.dbGetUserBy('id', id, 'users')
        let newUser = new User()

        if( results.length > 0 ) {
            newUser = new User(results[0].id, results[0].name, results[0].surname,
                results[0].sex, results[0].phonenumber, results[0].mail, results[0].password, results[0].dateofbirth)
        }
        return newUser
    }

    //da li je korisnik pohranjen u bazu podataka?
    async isUserInDb() {
        if (this.id === undefined)
            return false
        let u = await User.fetchById(this.id)
        return u.id !== undefined
    }

    //provjera zaporke
    checkPassword(password) {
        return this.password ? this.password === password : false
    }


    isAdmin(){
        return this._checkIsIn('admin')
    }

    isPatient(){
        return this._checkIsIn('patient')
    }

    isNurse(){
        return this._checkIsIn('nurse')
    }

    isDoctor(){
        return this._checkIsIn('doctor')
    }

    async _checkIsIn(where){
        const sql = "SELECT * FROM " + where + " where id = " + this.id
        const result = await db.query(sql, []);
        return result.length > 0;
    }


    //dohvat korisnika iz baze podataka na osnovu `what` i `table` odakle uzimamo
    // to moze biti doctor, nurse, admin, patient...
    static async dbGetUserBy(what, that, table){
        const sql = 'SELECT * FROM ' + table + ' WHERE ' + what + ' = ' + that;
        const result = await db.query(sql, []);
        return result;
    }

    //umetanje zapisa o korisniku u bazu podataka
    async saveUserToDb(){
        if (this.id !== undefined)
            throw 'cannot have defined id and try to save the user'

        const sql = "INSERT INTO users (name, surname, sex, phoneNumber, mail, password, dateOfBirth) VALUES ('" +
            this.name + "', '" + this.surname + "', '" +
            this.sex + "', '" + this.phonenumber + "', '" + this.mail + "', '" +
            this.password + "', '" + this.dateofbirth + "') RETURNING id;" // TODO remove doctor id

        const result = await db.query(sql, []);
        this.id = result[0].id
        return result
    }

    async _saveIdToDb(table){
        if (this.id !== undefined)
            throw 'cannot have defined id and try to save the user'
        const sql = "INSERT INTO " + table + " (id) VALUES ('" + this.id + " )";
        const result = await db.query(sql, []);
    }

    //brisanje zapisa o korisniku u bazi podataka
    async removeUserFromDb(){
        if (this.id === undefined)
            throw 'cannot have defined id and try to save the user'

        const sql = "DELETE FROM users where id = " + this.id
        const result = await db.query(sql, []);
        this.id = undefined
        return result
    }

    copySelfUser(){
        return User(
            this.id, this.name, this.surname, this.sex, this.phonenumber, this.mail, this.password, this.dateofbirth
        )
    }
}


class Patient extends User{
    constructor(id, name, surname, sex, phonenumber, mail, password, dateofbirth, rest={}){
        super(id, name, surname, sex, phonenumber, mail, password, dateofbirth)
        this.nFailedAppointments = rest.nFailedAppointments
        this.doctorid = rest.doctorid
        this.notificationMethod = rest.notificationMethod
        this.type = 'patient'
    }

    async addToDb(){
        if (await this.isUserInDb())
            console.log('the user was already there')
        else
            await this.saveUserToDb()
        
        const sql = "INSERT INTO patient (id, doctorid, nFailedAppointments, notificationMethod) VALUES (" +
             [this.id, this.doctorid, this.nFailedAppointments, "'"+this.notificationMethod+"'"].join(",") + ")";
        await db.query(sql, [], true);

    }

    static async getById(id){
        let users = await Patient.dbGetUserBy('id', id, 'users')
        let user = users[0]
        const sql = 'SELECT * FROM patient WHERE id = ' + id;
        const result = await db.query(sql, []);
        if (result.length === 0)
            throw 'user does not exist'
        return new Patient(
            user.id, user.name, user.surname, user.sex, user.phonenumber, user.mail, user.password, user.dateofbirth,
            result[0].doctorid, result[0].nfailedappointments, result[0].notificationMethod
            )
    }

    static async getAll(){
        //const sql = 'SELECT * FROM patient Natural Join users';  //zakomentirano dok se ne makne doctorid iz users tablice
        const sql = 'SELECT users.id, users.name, users.surname, users.sex, users.phonenumber, users.mail, users.password, users.dateOfBirth, patient.doctorid, patient.nFailedAppointments, patient.notificationMethod FROM patient Join users on users.id = patient.id';
        const results = await db.query(sql, []);
        if (results.length === 0)
            throw 'user does not exist'
        let toreturn = []
        for (let result of results)
            toreturn.push(
                new Patient(
                    result.id, result.name, result.surname, result.sex, result.phonenumber, result.mail, result.password, result.dateofbirth,
                    result.doctorid, result.nFailedAppointments, result.notificationMethod
                )
            )
        return toreturn;
    }
}



class Nurse extends User{
    constructor(id, name, surname, sex, phonenumber, mail, password, dateofbirth, rest={}){
        super(id, name, surname, sex, phonenumber, mail, password, dateofbirth)
        this.teamid = undefined
        this.type = 'nurse'
    }

    async addToDb(){
        if (await this.isUserInDb())
            console.log('the user was alread there')
        else
            await this.saveUserToDb()
        
        const sql = "INSERT INTO nurse (id, teamid) VALUES (" +
            [this.id, _stringify(this.teamid)].join(",") + " )";
        await db.query(sql, []);

    }

    static async getById(id){
        let users = await Nurse.dbGetUserBy('id', id, 'users')
        let user = users[0]
        const sql = 'SELECT * FROM nurse WHERE id = ' + id;
        const result = await db.query(sql, []);
        if (result.length === 0)
            throw 'user does not exist'
        return new Nurse(
            user.id, user.name, user.surname, user.sex, user.phonenumber, user.mail, user.password, user.dateofbirth,
            result.teamid
        )
    }

    static async getAll(){
        const sql = 'SELECT * FROM nurse Natural Join users';
        const results = await db.query(sql, []);
        if (results.length === 0)
            throw 'user does not exist'
        let toreturn = []
        for (let result of results)
            toreturn.push(
                new Nurse(
                    result.id, result.name, result.surname, result.sex, result.phonenumber, result.mail, result.password, result.dateofbirth,
                    result.teamid
                )
            )
        return toreturn;
    }

    static async getIdNameSurnameOfAll(){
        const sql = 'SELECT id, name, surname, teamid FROM nurse NATURAL JOIN users ORDER BY name, surname';
        const results = await db.query(sql, []);
        if (results.length === 0)
            throw 'user does not exist'
        let toreturn = []
        for (let result of results)
            toreturn.push(
                {id: result.id, name: result.name, surname: result.surname, teamid: result.teamid}
            )
        return toreturn;
    }

    static async getNameSurnameById(id){
        let users = await Nurse.dbGetUserBy('id', id, 'users')
        let user = users[0]
        return new Nurse(
            user.id, user.name, user.surname
            )
    }
}

class Doctor extends Nurse{
    constructor(id, name, surname, sex, phonenumber, mail, password, dateofbirth, rest={}){
        super(id, name, surname, sex, phonenumber, mail, password, dateofbirth)
        this.type = 'doctor'
    }

    async addToDb(){
        if (await this.isUserInDb())
            console.log('already there')
        else
            await this.saveUserToDb()

        const sql = "INSERT INTO doctor (id, teamid) VALUES (" +
            [this.id, _stringify(this.teamid)].join(",") + " )";
        await db.query(sql, []);


    }

    static async getById(id){
        let users = await Doctor.dbGetUserBy('id', id, 'users')
        let user = users[0]
        const sql = 'SELECT * FROM doctor WHERE id = ' + id;
        const result = await db.query(sql, []);
        if (result.length === 0)
            throw 'user does not exist'
        return new Doctor(
            user.id, user.name, user.surname, user.sex, user.phonenumber, user.mail, user.password, user.dateofbirth,
            result.teamid
        )
    }

    static async getAll(){
        const sql = 'SELECT * FROM doctor Natural Join users';
        const results = await db.query(sql, []);
        if (results.length === 0)
            throw 'user does not exist'
        let toreturn = []
        for (let result of results)
            toreturn.push(
                new Doctor(
                    result.id, result.name, result.surname, result.sex, result.phonenumber, result.mail, result.password, result.dateofbirth,
                    result.teamid
                )
            )
        return toreturn;
    }

    static async getIdNameSurnameOfAll(){
        const sql = 'SELECT id, name, surname, teamid FROM doctor NATURAL JOIN users ORDER BY name, surname';
        const results = await db.query(sql, []);
        if (results.length === 0)
            throw 'user does not exist'
        let toreturn = []
        for (let result of results)
            toreturn.push(
                {id: result.id, name: result.name, surname: result.surname, teamid: result.teamid}
            )
        return toreturn;
    }

    static async getNameSurnameById(id){
        let users = await Doctor.dbGetUserBy('id', id, 'users')
        let user = users[0]
        return new Doctor(
            user.id, user.name, user.surname
            )
    }
}

class Admin extends User{
    constructor(id, name, surname, sex, phonenumber, mail, password, dateofbirth, rest={}){
        super(id, name, surname, sex, phonenumber, mail, password, dateofbirth)
        this.type = 'admin'
    }
    async addToDb(){
        if (await this.isUserInDb())
            console.log('user already there')
        else
            await this.saveUserToDb()
        const sql = "INSERT INTO admin (id) VALUES (" + this.id + " )";
        await db.query(sql, []);
    }
}


module.exports = {
    'User' : User,
    'Patient': Patient,
    'Doctor': Doctor,
    'Nurse': Nurse,
    'Admin': Admin,
}


async function test(){
    // razred User enkapsulira korisnika web trgovine
    const sql = "SELECT * FROM users"
    console.log('selecting from db...')
    const result = await db.query(sql, []);

    u = new User()
    console.log('fetching id=1...')
    u = await User.fetchById(1)
    console.log(u)

    u = new User(
        id = undefined,
        name = 'ante',
        surname = 'iva',
        sex = 'M',
        phonenumber = 'asdaf',
        mail = 'fff',
        password = 'password',
        dateofbirth = '2020-01-01'
        )
    
    console.log('insertion...')
    console.log(u)
    const t = await u.saveUserToDb()
    console.log(u)
    console.log(t)
    console.log('deletion...')
    await u.removeUserFromDb()

}

// test()

