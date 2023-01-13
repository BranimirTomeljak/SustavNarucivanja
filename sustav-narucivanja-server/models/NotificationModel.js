const db = require('../db');
const nodemailer = require("nodemailer");
const cron = require('node-cron');
const xml2js = require('xml2js');
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
            user: "sustavzn@outlook.com",
            pass: "Narucivanje1950",
        }
    });
  
    if(reference.time != null){ //onda je appointment
        let patient = await Patient.getById(reference.patientid);
        var mailToSend = patient.mail;
    }
    else{
        var mailToSend = reference.mail;
    }
    
    if(reference.mail != null || reference.time != null)    //osoba ili appointmemnt
        var options = {
            from: "sustavzn@outlook.com",
            to: mailToSend,
            subject: getPurposeSubject(purpose),
            html: await getPurposeMessage(purpose, reference),
        };
    else{
        var options = { //izvješče HZZO-u
            from: "sustavzn@outlook.com",
            to: "mailadresahzzo@hzzo100posto.hr",
            subject: getPurposeSubject(purpose),
            attachments: [{
                filename: "xmlIzvjesce",
                content: reference,
                contentType: 'text/xml'
            }]
        };
    }
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

    else if(purpose == "remindDoctor")
        return "Podsjetnik za dodavanje termina 10 dana unaprijed";

    else if(purpose == "xmlDay")
        return "Dnevno izvješće Sustava za naručivanje";

    else if(purpose == "xmlMonth")
        return "Mjesečno izvješće Sustava za naručivanje";

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
        return `<p>Poštovani ${reference.name} ${reference.surname},<br /><br />
        Rezerviran Vam je termin u našemu sustavu. Molimo Vas provjerite pojedinosti o terminu na web stranici Sustava za naručivanje.<br /><br />
        Lijep pozdrav, Vaš Sustav za naručivanje!<br />
        
        <p style="color: blue"> Web stranica sustava: <a style="color: dark-blue" href="http://51.103.208.150/">http://51.103.208.150/</a></p>
        <p style="color: red; font-style: italic"> Null team 2022. </p>
        <p style="color: #878787; font-style: bold"> Ova poruka je automatski generirana </p>
        
        <img src="https://medicinarada.hr/wp-content/uploads/2020/04/hzzo_logo_posts.jpg" text-align="center" height="100px" alt="hzzo">`;

    else if(purpose == "appointmentCanceled"){
        let doctor = await Doctor.getById(reference.doctorid);
        return `<p>Poštovani ${doctor.name} ${doctor.surname},<br /><br />
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
        return `<p>Poštovani ${doctor.name} ${doctor.surname},<br /><br />
        Vaš pacijent je potvrdio promjenu termina u ${reference.time}. Molimo Vas provjerite pojedinosti promjene na web stranici Sustava za naručivanje.<br /><br />
        Lijep pozdrav, Vaš Sustav za naručivanje!<br />
        
        <p style="color: blue"> Web stranica sustava: <a style="color: dark-blue" href="http://51.103.208.150/">http://51.103.208.150/</a></p>
        <p style="color: red; font-style: italic"> Null team 2022. </p>
        <p style="color: #878787; font-style: bold"> Ova poruka je automatski generirana </p>
        
        <img src="https://medicinarada.hr/wp-content/uploads/2020/04/hzzo_logo_posts.jpg" text-align="center" height="100px" alt="hzzo">`;
    }

    else if(purpose == "appointmentChangeReject"){
        let doctor = await Doctor.getById(reference.doctorid);
        return `<p>Poštovani ${doctor.name} ${doctor.surname},<br /><br />
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
    
    else if(purpose == "remindDoctor")
        return `<p>Poštovani ${reference.name} ${reference.surname},<br /><br />
        Podsjećamo Vas da morate dodati termine pregleda 10 dana unaprijed. Molimo Vas provjerite vremena Vaših termina na web stranici Sustava za naručivanje.<br /><br />
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

    else if(purpose == "appointmentChangeRequest"){
        let patient = await Patient.getById(reference.patientid);
        return `Poštovani ${patient.name} ${patient.surname},
        Vaš doktor je zatražio promjenu termina. Molimo Vas provjerite pojedinosti promjene na web stranici Sustava za naručivanje.
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
            const currentDate = new Date();
            let difference = app.time.getTime() - currentDate.getTime();
            let daysDifference = Math.ceil(difference / (1000*60*60*24));
            let hoursDifference = difference / (1000*60*60) - 24;

            if (daysDifference == 1 && hoursDifference > -1) {
                let patient = await Patient.getById(app.patientid);
                sendEmail("reminder", patient.email);
            }
        }
    }, 60*60*1000); //svakih sat vremena
}

async function sendSMS(purpose, reference){
    const from = "Sustav za naručivanje";

    if(reference.phonenumber == null){ //onda je appointment
        let patient = await Patient.getById(reference.patientid);
        var numberToSend = patient.phonenumber;
    }
    else{
        var numberToSend = reference.phonenumber;
    }

    const to = "385".concat(numberToSend.substring(1));
    const text = await getPurposeSMS(purpose, reference);

    async function sendSms() {
        await vonage.sms.send({to, from, text})
            .then(resp => { console.log('Message sent successfully'); console.log(resp); })
            .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
    }

    //sendSms();
}

async function dailyReport(){
    const q1 = "SELECT count(id) FROM appointment where time >= NOW() - INTERVAL'24 hour'";
    const res1 = await db.query(q1, []);
    const q2 = "SELECT count(id) FROM appointment where time >= NOW() - INTERVAL'24 hour' and patient_came = true";
    const res2 = await db.query(q2, []);
    let zakazani = JSON.stringify(res1[0].count);
    let dosli = JSON.stringify(res2[0].count);
    dosli = dosli.substring(1, dosli.length - 1);
    zakazani = zakazani.substring(1, zakazani.length - 1);
    var obj = {
        root: {
            section: 'Dnevno izvješće o sastancima:',
        },
        body: {
            span: 'U protekla 24 sata ukupno je zakazano ' + zakazani + ' sastanaka.',
            a: 'Od toga se ' + dosli + ' pacijenata odazvalo na poziv.'
        },
        core: {},
        body1: {}
    };
    
    let numApp = JSON.stringify(res1[0].count);
    numApp = numApp.substring(1, numApp.length - 1);
    numApp = Number(numApp)
    if(numApp == 0)
        obj.core.child = 'Danas nije bilo rezerviranih niti obavljenih sastanaka.'

    const builder = new xml2js.Builder();
    let xml = builder.buildObject(obj);
    sendEmail("xmlDay", xml);
}

async function monthlyReport(){
    const q1 = "SELECT count(id) FROM appointment where time >= NOW() - INTERVAL'30 day'";
    const res1 = await db.query(q1, []);
    const q2 = "SELECT count(id) FROM appointment where time >= NOW() - INTERVAL'30 day' and patient_came = true";
    const res2 = await db.query(q2, []);
    let zakazani = JSON.stringify(res1[0].count);
    let dosli = JSON.stringify(res2[0].count);
    dosli = dosli.substring(1, dosli.length - 1);
    zakazani = zakazani.substring(1, zakazani.length - 1);
    
    var obj = {
        header: {
            div: 'Izvješće o sastancima u zadnjih 30 dana:',
        },
        body: {
            span: 'U protekla 30 dana ukupno je zakazano ' + zakazani + ' sastanaka.',
            a: 'Od toga se ' + dosli + ' pacijenata odazvalo na poziv.'
        },
        core: {}
    };

    let numApp = JSON.stringify(res1[0].count);
    numApp = numApp.substring(1, numApp.length - 1);
    numApp = Number(numApp)
    if(numApp == 0)
        obj.core.child = 'Posljednjih 30 dana nije bilo rezerviranih niti obavljenih sastanaka.'
    const builder = new xml2js.Builder();
    let xml = builder.buildObject(obj);
    sendEmail("xmlMonth", xml);
}

async function remindDoctorToAdd(id){
    const sql = "SELECT * FROM appointment WHERE doctorid = " + id + " AND time > (CURRENT_TIMESTAMP + INTERVAL '10' day)";
    const result = await db.query(sql, []);
    if(result.length == 0)  //nema termina poslije 10 dana od sada
        return true;
    else
        return false;
}

cron.schedule("0 0 0 * * *", async function () { // Daily report
    await dailyReport();
})

cron.schedule("0 0 */30 * *", async function () { // Monthly report
    await monthlyReport();
})

// notify doctor to add appointements if he/she doesn't have any in range [today + 10 days, inf>
cron.schedule("0 0 0 * * *", async function () {
    let doctors = Doctor.getAll();
    for(const doctor in doctors){
        const shouldSendEmail = await remindDoctorToAdd(doctor.id);
        if(shouldSendEmail)
            sendEmail("remindDoctor", doctor);
    }
})

module.exports = {
    sendEmail: sendEmail,
    appointmentReminderEmail: appointmentReminderEmail,
    sendSMS: sendSMS,
    sendNotification: sendNotification
}