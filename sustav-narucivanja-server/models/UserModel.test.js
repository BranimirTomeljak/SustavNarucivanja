const { User, Patient, Doctor, Nurse, Admin } = require("../models/UserModel");
const db = require("../db")


const cnt_users = async () => {
	const sql = "SELECT * FROM users";
	const result = await db.query(sql, []);
	return result.length
}


test('User fetching by id', async () => {
	let user = await User.fetchById(1);
	expected_user = {
		id:1,
		name:'Julijan', 
		surname:'Zlataric', 
		sex:'M', 
		phonenumber:'0971012013', 
		mail:'JulijanZlataric0@gmail.com',
		password:'11112013',
	}
	for (const key in expected_user)
		expect(user[key]).toBe(expected_user[key]);
});


test('User insertion and deletion', async () => {
	let u = new User(
		(id = undefined),
		(name = "ante"),
		(surname = "iva"),
		(sex = "M"),
		(phonenumber = "asdaf"),
		(mail = "fff"),
		(password = "password"),
		(dateofbirth = "2020-01-01")
	);

	let users_before = await cnt_users()
	await u.saveUserToDb();
	expect((await cnt_users())).toBe(users_before+1);
	
	await u.removeUserFromDb();
	expect((await cnt_users())).toBe(users_before);
});
