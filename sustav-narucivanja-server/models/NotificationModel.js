const db = require('../db');
const nodemailer = require("nodemailer");
const { Patient } = require("../models/UserModel");

const { Vonage } = require('@vonage/server-sdk');
const Appointment = require('./AppointmentModel');
const vonage = new Vonage({
    applicationId: 'da9774a8-73a3-4a59-9568-1937558b6b85',
    privateKey: './private.key',
    apiKey: "01bf6b5f",
    apiSecret: "jcfVCTE4UVYOaVfK"
});

async function sendNotification(method, purpose, mail, phoneNumber){
    if(method == "mail")
        sendEmail(purpose, mail);
    else
        sendSMS(purpose, phoneNumber);
}

//patientRegistration - registration
//appointmentBooking - appointmentBooked
//appointmentChange - appointmentChanged        TODO
//appointmentReminderEmail - reminder
async function sendEmail(purpose, mail){
    const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            user: "sustavzanarucivanje@outlook.com",
            pass: "Narucivanje1950",
        }
    });
  
    const options = {
        from: "sustavzanarucivanje@outlook.com",
        to: mail,
        subject: getPurposeSubject(purpose),
        html: getPurposeMessage(purpose, mail),
    };
  
    transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Send: " + info.response);
    });
}

function getPurposeSubject(purpose){    //TODO popravit
    if(purpose == "registration")
        return "Potvrda registracije na Sustav za naručivanje";

    else if(purpose == "appointmentBooked")
        return "Potvrda rezervacije termina na Sustav za naručivanje";

    else if(purpose == "appointmentChanged")
        return "Promjena termina rezervacije na Sustav za naručivanje";

    else if(purpose == "reminder")
        return "Podsjetnik za termin pregleda";

    else
        return undefined;
}

async function getPurposeMessage(purpose, mail){ //TODO popravit
    let patient = await Patient.fetchBymail(mail);
    if(purpose == "registration")
           return `<p>Poštovani ${patient.name} ${patient.surname},<br /><br />Uspješno ste se registrirali na Sustav za naručivanje.<br /><br />Lijep pozdrav, Vaš Sustav za naručivanje<br />
           <img src="sustav-narucivanja\sustav-narucivanja\sustav-narucivanja\src\assets\img\hzzo.jpg">`;
    else if(purpose == "appointmentBooked")
           return `<p>Poštovani ${patient.name} ${patient.surname},<br /><br />Rezerviran Vam je termin u  ${undefined} i traje  ${undefined} minuta. </p><p>Lijep pozdrav</p>`;
    else if(purpose == "appointmentChanged")
           return `<p>Poštovani ${patient.name} ${patient.surname},<br /><br />Promijenjen Vam je termin u ${undefined} i traje ${undefined} minuta.</p><p>Lijep pozdrav</p>`;
    else if(purpose == "reminder")
           return `<p>Poštovani ${patient.name} ${patient.surname},</p><p><br> Podsjećamo Vas da imate termin sutra: ${undefined}.<br><br>Lijep pozdrav, Vaš Sustav za naručivanje</p>`;
    else
           return undefined;
        
    
}

function getPurposeSMS(purpose){    //TODO popravit
    if(purpose == "registration")
        return `registration`;

    else if(purpose == "appointmentBooked")
        return `appointmentBooked`;

    else if(purpose == "appointmentChanged")
        return `appointmentChanged`;

    else if(purpose == "reminder")
        return `reminder`;
        
    else
        return undefined;
}

async function appointmentReminderEmail() {
    setInterval(async function(){
        const sql = "SELECT * FROM appointment";
        const appointments = await db.query(sql, []);

        for (let app of appointments) {
            const currentDate = new Date();                                 //program cita vremena sva sat unazad
            //const testDate = new Date("2022-12-18 10:04:00");
            //let difference = testDate.getTime() - currentDate.getTime();
            let difference = app.time.getTime() - currentDate.getTime();
            let daysDifference = Math.ceil(difference / (1000*60*60*24));
            let hoursDifference = difference / (1000*60*60) - 24;

            if (daysDifference == 1 && hoursDifference > -1) {
                let patient = await Patient.getById(app.patientid);
                sendEmail("reminder", patient.email);
            }
        }
    }, 60*60*1000);
}

async function sendSMS(purpose, phoneNumber){
    const from = "Sustav za naručivanje"
    const to = phoneNumber
    const text = getPurposeSMS(purpose);

    async function sendSms() {
        await vonage.sms.send({to, from, text})
            .then(resp => { console.log('Message sent successfully'); console.log(resp); })
            .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
    }

    // sendSms();    //simulacija
}

module.exports = {
    sendEmail: sendEmail,
    appointmentReminderEmail: appointmentReminderEmail,
    sendSMS: sendSMS,
    sendNotification: sendNotification
}

console.log(getPurposeMessage('registration', 'bruno.racki@fer.hr'));
sendEmail('registration', 'bruno.racki@fer.hr')

