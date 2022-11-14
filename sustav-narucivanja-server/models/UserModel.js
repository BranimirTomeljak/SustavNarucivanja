const db = require('../db')

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
        let newUser = new User()

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
        return result.rows.length > 0;
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

        const sql = "INSERT INTO users (name, surname, sex, phonenumber, mail, password, dateofbirth, doctorid) VALUES ('" +
            this.name + "', '" + this.surname + "', '" +
            this.sex + "', '" + this.phonenumber + "', '" + this.mail + "', '" +
            this.password + "', '" + this.dateofbirth + "' ,1) RETURNING id;" // TODO remove doctor id

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
    constructor(id, name, surname, sex, phonenumber, mail, password, dateofbirth, doctorid, nFailedAppointments){
        super(id, name, surname, sex, phonenumber, mail, password, dateofbirth)
        this.nFailedAppointments = nFailedAppointments
        this.doctorid = doctorid
        this.type = 'patient'
    }

    async addToDb(){
        if (await this.isUserInDb())
            console.log('the user was alread there')
        else
            await this.saveUserToDb()
        
        const sql = "INSERT INTO patient (id, doctorid, nFailedAppointments) VALUES (" +
             [this.id, this.doctorid, this.nFailedAppointments].join(",") + " )";
        await db.query(sql, []);

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
            result[0].doctorid, result[0].nfailedappointments
            )

    }
}



class Nurse extends User{
    constructor(id, name, surname, sex, phonenumber, mail, password, dateofbirth, teamid){
        super(id, name, surname, sex, phonenumber, mail, password, dateofbirth)
        this.teamid = teamid
        this.type = 'nurse'
    }

    async addToDb(){
        if (await this.isUserInDb())
            console.log('the user was alread there')
        else
            await this.saveUserToDb()
        
        const sql = "INSERT INTO nurse (id, teamid) VALUES (" +
            [this.id, this.teamid].join(",") + " )";
        await db.query(sql, []);

    }

    static async getById(id){
        let users = await Nurse.dbGetUserBy('id', id)
        let user = users[0]
        const sql = 'SELECT * FROM nurse WHERE id = ' + id;
        const result = await db.query(sql, []);
        if (result.length === 0)
            throw 'user does not exist'
        return Nurse(
            user.id, user.name, user.surname, user.sex, user.phonenumber, user.mail, user.password, user.dateofbirth,
            result.teamid
        )
    }

    async getAll(){
        const sql = 'SELECT * FROM nurse Natural Join user';
        const results = await db.query(sql, []);
        if (results.length === 0)
            throw 'user does not exist'
        toreturn = []
        for (let result of results)
            toreturn.append(
                Nurse(
                    result.id, result.name, result.surname, result.sex, result.phonenumber, result.mail, result.password, result.dateofbirth,
                    resuult.teamid
                )
            )
    }
}

class Doctor extends Nurse{
    constructor(id, name, surname, sex, phonenumber, mail, password, dateofbirth){
        super(id, name, surname, sex, phonenumber, mail, password, dateofbirth)
        this.type = 'doctor'
    }

    async addToDb(){
        if (await this.isUserInDb())
            console.log('already there')
        else
            this.saveUserToDb()

        const sql = "INSERT INTO doctor (id, teamid) VALUES (" +
            [this.id, this.teamid].join(",") + " )";
        await db.query(sql, []);


    }

    static async getById(id){
        let users = await Doctor.dbGetUserBy('id', id)
        let user = users[0]
        const sql = 'SELECT * FROM doctor WHERE id = ' + id;
        const result = await db.query(sql, []);
        if (result.length === 0)
            throw 'user does not exist'
        return Doctor(
            user.id, user.name, user.surname, user.sex, user.phonenumber, user.mail, user.password, user.dateofbirth,
            result.teamid
        )
    }

    async getAll(){
        const sql = 'SELECT * FROM doctor Natural Join user';
        const results = await db.query(sql, []);
        if (results.length === 0)
            throw 'user does not exist'
        toreturn = []
        for (let result of results)
            toreturn.append(
                Doctor(
                    result.id, result.name, result.surname, result.sex, result.phonenumber, result.mail, result.password, result.dateofbirth,
                    resuult.teamid
                )
            )
    }

}

class Admin extends User{
    constructor(id, name, surname, sex, phonenumber, mail, password, dateofbirth){
        super(id, name, surname, sex, phonenumber, mail, password, dateofbirth)
        this.type = 'admin'
    }
    async addToDb(){
        const sql = "INSERT INTO admin (id) VALUES (" + this.id + " )";
        await db.query(sql, []);
        if (await this.isUserInDb())
            console.log('user already there')
        else
            this.saveUserToDb()
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

