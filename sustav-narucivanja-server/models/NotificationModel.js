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

async function sendNotification(method, purpose, person){
    console.log("!! ");
    console.log(person);
    if(method == "sms")
        sendSMS(purpose, person);   
    else
        sendEmail(purpose, person);
}

//patientRegistration - registration
//appointmentBooking - appointmentBooked
//appointmentChange - appointmentChanged        TODO
//appointmentReminderEmail - reminder
async function sendEmail(purpose, person){
    const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            user: "sustavzanarucivanje@outlook.com",
            pass: "Narucivanje1950",
        }
    });
  
    const options = {
        from: "sustavzanarucivanje@outlook.com",
        to: person.mail,
        subject: getPurposeSubject(purpose),
        html: getPurposeMessage(purpose, person),
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

function getPurposeMessage(purpose, person){ //TODO popravit
    if(purpose == "registration")
        return `<p>Poštovani ${person.name} ${person.surname},<br /><br />
        uspješno ste se registrirali na Sustav za naručivanje.<br /><br />
        Lijep pozdrav, Vaš Sustav za naručivanje!<br />
        
        <p style="color: blue"> Web stranica sustava: <a style="color: dark-blue" href="http://51.103.208.150/">http://51.103.208.150/</a></p>
        <p style="color: red; font-style: italic"> Null team 2022. </p>
        <p style="color: #878787; font-style: bold"> Ova poruka je automatski generirana </p>
        
        <img src="https://medicinarada.hr/wp-content/uploads/2020/04/hzzo_logo_posts.jpg" text-align="center" height="100px" alt="hzzo">`;
    else if(purpose == "appointmentBooked")
        return `<p>Poštovani ${person.name} ${person.surname},<br /><br />
        rezerviran Vam je termin u našemu sustavu. Molimo Vas provjerite pojedinosti o terminu na web stranici Sustava za naručivanje.<br /><br />
        Lijep pozdrav, Vaš Sustav za naručivanje!<br />
        
        <p style="color: blue"> Web stranica sustava: <a style="color: dark-blue" href="http://51.103.208.150/">http://51.103.208.150/</a></p>
        <p style="color: red; font-style: italic"> Null team 2022. </p>
        <p style="color: #878787; font-style: bold"> Ova poruka je automatski generirana </p>
        
        <img src="https://medicinarada.hr/wp-content/uploads/2020/04/hzzo_logo_posts.jpg" text-align="center" height="100px" alt="hzzo">`;
    else if(purpose == "appointmentChanged")
        return `<p>Poštovani ${person.name} ${person.surname},<br /><br />
        promijenjen Vam je termin u našemu sustavu. Molimo Vas provjerite pojedinosti promjeni termina na web stranici Sustava za naručivanje.<br /><br />
        Lijep pozdrav, Vaš Sustav za naručivanje!<br />
        
        <p style="color: blue"> Web stranica sustava: <a style="color: dark-blue" href="http://51.103.208.150/">http://51.103.208.150/</a></p>
        <p style="color: red; font-style: italic"> Null team 2022. </p>
        <p style="color: #878787; font-style: bold"> Ova poruka je automatski generirana </p>
        
        <img src="https://medicinarada.hr/wp-content/uploads/2020/04/hzzo_logo_posts.jpg" text-align="center" height="100px" alt="hzzo">`;
    else if(purpose == "reminder")
        return `<p>Poštovani ${person.name} ${person.surname},<br /><br />
        podsjećamo Vas da imate rezerviran termin u našemu sustavu. Molimo Vas provjerite pojedinosti o terminu na web stranici Sustava za naručivanje.<br /><br />
        Lijep pozdrav, Vaš Sustav za naručivanje!<br />
        
        <p style="color: blue"> Web stranica sustava: <a style="color: dark-blue" href="http://51.103.208.150/">http://51.103.208.150/</a></p>
        <p style="color: red; font-style: italic"> Null team 2022. </p>
        <p style="color: #878787; font-style: bold"> Ova poruka je automatski generirana </p>
        
        <img src="https://medicinarada.hr/wp-content/uploads/2020/04/hzzo_logo_posts.jpg" text-align="center" height="100px" alt="hzzo">`;
    else
        return undefined;
}

function getPurposeSMS(purpose, person){    //TODO popravit
    if(purpose == "registration")
        return `Poštovani ${person.name} ${person.surname},
        uspješno ste rezervirali termin u našemu sustavu. 
        Lijep pozdrav, Vaš Sustav za naručivanje!
        Web stranica sustava: http://51.103.208.150/`;

    else if(purpose == "appointmentBooked")
        return `Poštovani ${person.name} ${person.surname},
        rezerviran Vam je termin u našemu sustavu. Molimo Vas provjerite pojedinosti o terminu na web stranici Sustava za naručivanje.
        Lijep pozdrav, Vaš Sustav za naručivanje!
        Web stranica sustava: http://51.103.208.150/`;

    else if(purpose == "appointmentChanged")
        return `Poštovani ${person.name} ${person.surname},
        promijenjen Vam je termin u našemu sustavu. Molimo Vas provjerite pojedinosti promjeni termina na web stranici Sustava za naručivanje.
        Lijep pozdrav, Vaš Sustav za naručivanje!
        Web stranica sustava: http://51.103.208.150/`;

    else if(purpose == "reminder")
        return `Poštovani ${person.name} ${person.surname},
        Podsjećamo Vas da imate rezerviran termin u našemu sustavu. Molimo Vas provjerite pojedinosti o terminu na web stranici Sustava za naručivanje.
        Lijep pozdrav, Vaš Sustav za naručivanje!
        Web stranica sustava: http://51.103.208.150/`;
        
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

async function sendSMS(purpose, person){
    const from = "Sustav za naručivanje"
    const to = person.phoneNumber
    const text = getPurposeSMS(purpose, person);

    async function sendSms() {
        await vonage.sms.send({to, from, text})
            .then(resp => { console.log('Message sent successfully'); console.log(resp); })
            .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
    }

    //sendSms();    //simulacija
    //sendEmail("appointmentBooked", "bruno.racki@fer.hr");
}


module.exports = {
    sendEmail: sendEmail,
    appointmentReminderEmail: appointmentReminderEmail,
    sendSMS: sendSMS,
    sendNotification: sendNotification
}

//console.log(getPurposeMessage('registration', 'bruno.racki@fer.hr'));