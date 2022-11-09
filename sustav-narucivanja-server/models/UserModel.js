const db = require('../db')

class User {
    //konstruktor korisnika
    constructor(
        id=undefined, 
        first_name=undefined, 
        last_name=undefined, 
        sex=undefined, 
        phoneNumber=undefined, 
        mail=undefined, 
        password=undefined, 
        dateOfBirth=undefined
    ) {
        this.id = id
        this.first_name = first_name
        this.last_name = last_name
        this.sex = sex
        this.phoneNumber = phoneNumber
        this.mail = mail
        this.password = password
        this.dateOfBirth = dateOfBirth
    }

    //dohvat korisnika na osnovu mail adrese
    static async fetchBymail(mail) {

        let results = await User.dbGetUserBy('mail', mail, 'users')
        let newUser = new User()

        if( results.length > 0 ) {
            newUser = new User(results[0].user_name, results[0].first_name,
                results[0].last_name, results[0].mail, results[0].password, results[0].role)
            newUser.id = results[0].id
        }
        return newUser
    }

    //dohvat korisnika na osnovu id korisnika (tablica users)
    static async fetchById(id) {

        let results = await User.dbGetUserBy('id', id, 'users')
        let newUser = new User()

        if( results.length > 0 ) {
            newUser = new User(results[0].user_name, results[0].first_name,
                results[0].last_name, results[0].mail, results[0].password, results[0].role)
            newUser.id = results[0].id
        }
        return newUser
    }

    //da li je korisnik pohranjen u bazu podataka?
    isPersisted() {
        return this.id !== undefined
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
        console.log('result is', result, table, what, that)
        return result;
    }

    //umetanje zapisa o korisniku u bazu podataka
    async saveUserToDb(){
        if (this.id !== undefined)
            throw 'cannot have defined id and try to save the user'

        const sql = "INSERT INTO users (first_name, last_name, sex, phoneNumber, mail, password, dateOfBirth) VALUES ('" +
            this.first_name + "', '" + this.last_name + "', '" +
            this.sex + "', '" + this.phoneNumber + "', '" + this.mail + "', '" +
            this.password + "', '" + this.dateOfBirth + "');"

        const result = await db.query(sql, []);
        return result[0].id;
    }

}


class Patient extends User{
    constructor(id, first_name, last_name, sex, phoneNumber, mail, password, dateOfBirth){
        super(id, first_name, last_name, sex, phoneNumber, mail, password, dateOfBirth)
    }

    make_appointment(when, how_long){
        // TODO
        app = Appointment(when, how_long)
        app.saveUserToDb()
    }
}


class Doctor extends User{
    constructor(id, first_name, last_name, sex, phoneNumber, mail, password, dateOfBirth){
        super(id, first_name, last_name, sex, phoneNumber, mail, password, dateOfBirth)
    }

    change_appointment(when, how_long){
        // TODO
    }
}

class Nurse extends User{
    constructor(id, first_name, last_name, sex, phoneNumber, mail, password, dateOfBirth){
        super(id, first_name, last_name, sex, phoneNumber, mail, password, dateOfBirth)
    }
    isNurse(){
        return True
    }
}

class Admin extends User{
    constructor(id, first_name, last_name, sex, phoneNumber, mail, password, dateOfBirth){
        super(id, first_name, last_name, sex, phoneNumber, mail, password, dateOfBirth)
    }
    isAdmin(){
        return True
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
    const result = await db.query(sql, []);
    console.log('the result is')
    console.log(result)
    u = new User()
    console.log(u)
    u = await User.fetchById(1)
    console.log(u)
    u.id = undefined
    u.first_name = 'Marting'
    await u.saveUserToDb()
    u = await User.fetchById(4)
    console.log(u)

    
}

// test()

