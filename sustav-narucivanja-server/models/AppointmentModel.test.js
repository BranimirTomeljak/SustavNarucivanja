const Appointment = require("./AppointmentModel");
const db = require("../db")


// fetching
test('Appointment fetching by id', async () => {
	let app = (await Appointment.fetchBy('id', 1))[0];
	expected_app = {
		patientid:100, 
		doctorid:7, 
		nurseid:null, 
		time:"Sat Jan 10 2015 01:51:14 GMT+0100 (Central European Standard Time)", 
		duration:{minutes:20},
		created_on: null,
		changes_from: null,
		patient_came: null,
	}
	for (const key in expected_app){
		expect(app[key]+"").toBe(expected_app[key]+"");
	}
});


// confliction detection
test('Appointment confliction detection - same time', async () => {
	let app = (await Appointment.fetchBy('id', 1))[0];
	app.id = undefined
	app.time = app.time.toISOString()
	app.duration = '00:01:00'
	expect((await app.conflictsWithDb())+"").toBe(true+"");
});

test('Appointment confliction detection - same id', async () => {
	let app = (await Appointment.fetchBy('id', 1))[0];
	app.time = app.time.toISOString()
	app.duration = '00:01:00'
	expect((await app.conflictsWithDb())+"").toBe(false+"");
});

test('Appointment confliction detection - ovarlaping', async () => {
	let app = (await Appointment.fetchBy('id', 1))[0];
	app.id = undefined
	app.time.setMinutes(app.time.getMinutes() + 10);
	app.time = app.time.toISOString()
	app.duration = '00:01:00'
	expect((await app.conflictsWithDb())+"").toBe(true+"");
});

test('Appointment confliction detection - non ovarlaping', async () => {
	let app = (await Appointment.fetchBy('id', 1))[0];
	app.id = undefined
	app.time.setMinutes(app.time.getMinutes() + 60*24*365*200);
	app.time = app.time.toISOString()
	app.duration = '00:01:00'
	expect((await app.conflictsWithDb())+"").toBe(false+"");
});


// appointment change, used in reserving, canceling...
test('Appointment update', async () => {
	let app = (await Appointment.fetchBy('id', 1))[0];
	app.type = "test"
	await app.updateDb()
	app2 = (await Appointment.fetchBy('id', 1))[0];
	for (const key in app2)
		expect(app[key]+"").toBe(app2[key]+"");
	app.type = undefined
	await app.updateDb()
});