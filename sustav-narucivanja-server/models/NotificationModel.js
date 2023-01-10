const db = require('../db');
const nodemailer = require("nodemailer");
const { Patient, Doctor } = require("../models/UserModel");

const { Vonage } = require('@vonage/server-sdk');
const vonage = new Vonage({
    applicationId: 'da9774a8-73a3-4a59-9568-1937558b6b85',
    privateKey: './private.key',
    apiKey: "01bf6b5f",
    apiSecret: "jcfVCTE4UVYOaVfK"
});

async function sendNotification(method, purpose, reference){
    if(method == "sms")
        sendSMS(purpose, reference);   
    else
        sendEmail(purpose, reference);
}

async function sendEmail(purpose, reference){
    const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            user: "sustavzanarucivanje@outlook.com",
            pass: "Narucivanje1950",
        }
    });
  
    if(reference.mail == null){ //onda je appointment
        let patient = await Patient.getById(reference.patientid);
        var mailToSend = patient.mail;
    }
    else{
        var mailToSend = reference.mail;
    }
    const options = {
        from: "sustavzanarucivanje@outlook.com",
        to: mailToSend,
        subject: getPurposeSubject(purpose),
        html: await getPurposeMessage(purpose, reference),
    };
  
    transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Send: " + info.response);
    });
}

function getPurposeSubject(purpose){
    if(purpose == "registration")
        return "Potvrda registracije na Sustav za naručivanje";

    else if(purpose == "appointmentReserved")
        return "Potvrda rezervacije termina na Sustavu za naručivanje";

    else if(purpose == "appointmentCanceled")
        return "Termin pacijenta otkazan";

    else if(purpose == "appointmentChangeRequest")
        return "Zahtjev promjene termina rezervacije na Sustavu za naručivanje";

    else if(purpose == "appointmentChangeAccept")
        return "Potvrda promjene termina rezervacije na Sustavu za naručivanje";
    
    else if(purpose == "appointmentChangeReject")
        return "Odbijen zahtjev promjene termina rezervacije na Sustavu za naručivanje";

    else if(purpose == "reminder")
        return "Podsjetnik za termin pregleda";

    else
        return undefined;
}

async function getPurposeMessage(purpose, reference){
    if(purpose == "registration")
        return `<p>Poštovani ${reference.name} ${reference.surname},<br /><br />
        Uspješno ste se registrirali na Sustav za naručivanje.<br /><br />
        Lijep pozdrav, Vaš Sustav za naručivanje!<br />
        
        <p style="color: blue"> Web stranica sustava: <a style="color: dark-blue" href="http://51.103.208.150/">http://51.103.208.150/</a></p>
        <p style="color: red; font-style: italic"> Null team 2022. </p>
        <p style="color: #878787; font-style: bold"> Ova poruka je automatski generirana </p>
        
        <img src="https://medicinarada.hr/wp-content/uploads/2020/04/hzzo_logo_posts.jpg" text-align="center" height="100px" alt="hzzo">`;

    else if(purpose == "appointmentReserved")
        return `<p>Poštovani dr. ${reference.name} ${reference.surname},<br /><br />
        Rezerviran Vam je termin u našemu sustavu. Molimo Vas provjerite pojedinosti o terminu na web stranici Sustava za naručivanje.<br /><br />
        Lijep pozdrav, Vaš Sustav za naručivanje!<br />
        
        <p style="color: blue"> Web stranica sustava: <a style="color: dark-blue" href="http://51.103.208.150/">http://51.103.208.150/</a></p>
        <p style="color: red; font-style: italic"> Null team 2022. </p>
        <p style="color: #878787; font-style: bold"> Ova poruka je automatski generirana </p>
        
        <img src="https://medicinarada.hr/wp-content/uploads/2020/04/hzzo_logo_posts.jpg" text-align="center" height="100px" alt="hzzo">`;

    else if(purpose == "appointmentCanceled"){
        let doctor = await Doctor.getById(reference.doctorid);
        return `<p>Poštovani dr. ${doctor.name} ${doctor.surname},<br /><br />
        Nažalost, otkazan Vam je termin u ${reference.time}.<br /><br />
        Lijep pozdrav, Vaš Sustav za naručivanje!<br />
        
        <p style="color: blue"> Web stranica sustava: <a style="color: dark-blue" href="http://51.103.208.150/">http://51.103.208.150/</a></p>
        <p style="color: red; font-style: italic"> Null team 2022. </p>
        <p style="color: #878787; font-style: bold"> Ova poruka je automatski generirana </p>
        
        <img src="https://medicinarada.hr/wp-content/uploads/2020/04/hzzo_logo_posts.jpg" text-align="center" height="100px" alt="hzzo">`;
    }
    
    else if(purpose == "appointmentChangeRequest"){
        let patient = await Patient.getById(reference.patientid);
        return `<p>Poštovani ${patient.name} ${patient.surname},<br /><br />
        Vaš doktor je zatražio promjenu termina. Molimo Vas provjerite pojedinosti promjene na web stranici Sustava za naručivanje.<br /><br />
        Lijep pozdrav, Vaš Sustav za naručivanje!<br />
        
        <p style="color: blue"> Web stranica sustava: <a style="color: dark-blue" href="http://51.103.208.150/">http://51.103.208.150/</a></p>
        <p style="color: red; font-style: italic"> Null team 2022. </p>
        <p style="color: #878787; font-style: bold"> Ova poruka je automatski generirana </p>
        
        <img src="https://medicinarada.hr/wp-content/uploads/2020/04/hzzo_logo_posts.jpg" text-align="center" height="100px" alt="hzzo">`;
    }

    else if(purpose == "appointmentChangeAccept"){
        let doctor = await Doctor.getById(reference.doctorid);
        return `<p>Poštovani dr. ${doctor.name} ${doctor.surname},<br /><br />
        Vaš pacijent je potvrdio promjenu termina u ${reference.time}. Molimo Vas provjerite pojedinosti promjene na web stranici Sustava za naručivanje.<br /><br />
        Lijep pozdrav, Vaš Sustav za naručivanje!<br />
        
        <p style="color: blue"> Web stranica sustava: <a style="color: dark-blue" href="http://51.103.208.150/">http://51.103.208.150/</a></p>
        <p style="color: red; font-style: italic"> Null team 2022. </p>
        <p style="color: #878787; font-style: bold"> Ova poruka je automatski generirana </p>
        
        <img src="https://medicinarada.hr/wp-content/uploads/2020/04/hzzo_logo_posts.jpg" text-align="center" height="100px" alt="hzzo">`;
    }

    else if(purpose == "appointmentChangeReject"){
        let doctor = await Doctor.getById(reference.doctorid);
        return `<p>Poštovani dr. ${doctor.name} ${doctor.surname},<br /><br />
        Vaš pacijent je odbio promjenu termina u ${reference.time}. Molimo Vas provjerite pojedinosti promjene na web stranici Sustava za naručivanje.<br /><br />
        Lijep pozdrav, Vaš Sustav za naručivanje!<br />
        
        <p style="color: blue"> Web stranica sustava: <a style="color: dark-blue" href="http://51.103.208.150/">http://51.103.208.150/</a></p>
        <p style="color: red; font-style: italic"> Null team 2022. </p>
        <p style="color: #878787; font-style: bold"> Ova poruka je automatski generirana </p>
        
        <img src="https://medicinarada.hr/wp-content/uploads/2020/04/hzzo_logo_posts.jpg" text-align="center" height="100px" alt="hzzo">`;
    }

    else if(purpose == "reminder")
        return `<p>Poštovani ${reference.name} ${reference.surname},<br /><br />
        Podsjećamo Vas da sutra imate rezerviran termin u našemu sustavu. Molimo Vas provjerite pojedinosti o terminu na web stranici Sustava za naručivanje.<br /><br />
        Lijep pozdrav, Vaš Sustav za naručivanje!<br />
        
        <p style="color: blue"> Web stranica sustava: <a style="color: dark-blue" href="http://51.103.208.150/">http://51.103.208.150/</a></p>
        <p style="color: red; font-style: italic"> Null team 2022. </p>
        <p style="color: #878787; font-style: bold"> Ova poruka je automatski generirana </p>
        
        <img src="https://medicinarada.hr/wp-content/uploads/2020/04/hzzo_logo_posts.jpg" text-align="center" height="100px" alt="hzzo">`;
    
    else
        return undefined;
}

async function getPurposeSMS(purpose, reference){
    if(purpose == "registration")
        return `Poštovani ${reference.name} ${reference.surname},
        uspješno ste rezervirali termin u našemu sustavu. 
        Lijep pozdrav, Vaš Sustav za naručivanje!
        Web stranica sustava: http://51.103.208.150/`;

    else if(purpose == "appointmentReserved")
        return `Poštovani dr. ${reference.name} ${reference.surname},
        rezerviran Vam je termin u našemu sustavu. Molimo Vas provjerite pojedinosti o terminu na web stranici Sustava za naručivanje.
        Lijep pozdrav, Vaš Sustav za naručivanje!
        Web stranica sustava: http://51.103.208.150/`;

    else if(purpose == "appointmentCanceled"){
        let doctor = await Doctor.getById(reference.doctorid);
        return `Poštovani dr. ${doctor.name} ${doctor.surname},
        Nažalost, otkazan Vam je termin u ${reference.time}.
        Lijep pozdrav, Vaš Sustav za naručivanje!
        Web stranica sustava: http://51.103.208.150/`;
    }

    else if(purpose == "appointmentChangeRequest"){
        let patient = await Patient.getById(reference.patientid);
        return `Poštovani ${patient.name} ${patient.surname},
        Vaš doktor je zatražio promjenu termina. Molimo Vas provjerite pojedinosti promjene na web stranici Sustava za naručivanje.
        Lijep pozdrav, Vaš Sustav za naručivanje!
        Web stranica sustava: http://51.103.208.150/`;
    }

    else if(purpose == "appointmentChangeAccept"){
        let doctor = await Doctor.getById(reference.doctorid);
        return `Poštovani dr. ${doctor.name} ${doctor.surname},
        Vaš pacijent je potvrdio promjenu termina u ${reference.time}. Molimo Vas provjerite pojedinosti promjene na web stranici Sustava za naručivanje.
        Lijep pozdrav, Vaš Sustav za naručivanje!
        Web stranica sustava: http://51.103.208.150/`;
    }

    else if(purpose == "appointmentChangeReject"){
        let doctor = await Doctor.getById(reference.doctorid);
        return `Poštovani dr. ${doctor.name} ${doctor.surname},
        Vaš pacijent je odbio promjenu termina u ${reference.time}. Molimo Vas provjerite pojedinosti promjene na web stranici Sustava za naručivanje.
        Lijep pozdrav, Vaš Sustav za naručivanje!
        Web stranica sustava: http://51.103.208.150/`;
    }

    else if(purpose == "reminder")
        return `Poštovani ${reference.name} ${reference.surname},
        Podsjećamo Vas da sutra imate rezerviran termin u našemu sustavu. Molimo Vas provjerite pojedinosti o terminu na web stranici Sustava za naručivanje.
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

async function sendSMS(purpose, reference){
    const from = "Sustav za naručivanje";

    if(reference.phoneNumber == null){ //onda je appointment
        let patient = await Patient.getById(reference.patientid);
        var numberToSend = patient.phoneNumber;
    }
    else{
        var numberToSend = reference.phoneNumber;
    }

    const to = numberToSend;
    const text = await getPurposeSMS(purpose, reference);

    async function sendSms() {
        await vonage.sms.send({to, from, text})
            .then(resp => { console.log('Message sent successfully'); console.log(resp); })
            .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
    }

    //sendSms();
}


module.exports = {
    sendEmail: sendEmail,
    appointmentReminderEmail: appointmentReminderEmail,
    sendSMS: sendSMS,
    sendNotification: sendNotification
}