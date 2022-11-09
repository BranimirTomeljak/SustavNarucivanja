const {
    Pool
} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'medicina',
    password: 'postgres',
    port: 5432,
});

const drop_tables = `
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
`


const sql_create_patient = `CREATE TABLE users (
    id int  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL UNIQUE,
    email text NOT NULL UNIQUE
)`;

const sql_create_doctor = `CREATE TABLE doctor (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL UNIQUE,
    email text NOT NULL UNIQUE
)`;

const sql_create_nurse = `CREATE TABLE nurse (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL UNIQUE,
    email text NOT NULL UNIQUE
)`;


const sql_create_appointment = `CREATE TABLE appointment (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient int NOT NULL,
    time_when DATE NOT NULL,
    how_long int NOT NULL,
    doctor int,
    nurse int,
    CONSTRAINT who CHECK ((doctor IS NULL AND nurse IS NOT NULL) OR (doctor IS NOT NULL AND nurse is NULL))
)`;

const sql_insert_patient = `INSERT INTO users (name, email)
    VALUES 
    ('Pero', 'pero.p@gmail.com'),
    ('Ante', 'ante.p@gmail.com'),
    ('Iva', 'iva.p@gmail.com');
`;

const sql_insert_doctor = `INSERT INTO doctor (
    name, email)
    VALUES 
    ('Pero', 'pero.p@gmail.com'),
    ('Ante', 'ante.p@gmail.com'),
    ('Iva', 'iva.p@gmail.com');
`;

const sql_insert_nurse = `INSERT INTO nurse (
    name, email)
    VALUES 
    ('Pero', 'pero.p@gmail.com'),
    ('Ante', 'ante.p@gmail.com'),
    ('Iva', 'iva.p@gmail.com');
`;

let table_names = [
    "patient",
    "doctor",
    "nurse",
    "appointment"
]

let tables = [
    sql_create_patient,
    sql_create_doctor,
    sql_create_nurse,
    sql_create_appointment,
];

let table_data = [
    sql_insert_patient,
    sql_insert_doctor,
    sql_insert_nurse,
    undefined,
]

let indexes = [
];

if ((tables.length !== table_data.length) || (tables.length !== table_names.length)) {
    console.log("tables, names and data arrays length mismatch.")
    return
}

//create tables and populate with data (if provided)

(async () => {
    console.log("Dropping tables");
    try {
        await pool.query(drop_tables, [])
        console.log("dropped all tables.")
    } catch (err) {
        console.log("Error could not drop all tables")
    }

    console.log("Creating and populating tables");
    for (let i = 0; i < tables.length; i++) {
        console.log("Creating table " + table_names[i] + ".");
        console.log(tables[i])
        try {

            await pool.query(tables[i], [])
            console.log("Table " + table_names[i] + " created.");
            if (table_data[i] !== undefined) {
                try {
                    await pool.query(table_data[i], [])
                    console.log("Table " + table_names[i] + " populated with data.");
                } catch (err) {
                    console.log("Error populating table " + table_names[i] + " with data.")
                    return console.log(err.message);
                }
            }
        } catch (err) {
            console.log("Error creating table " + table_names[i])
            return console.log(err.message);
        }
    }

    console.log("Creating indexes");
    for (let i = 0; i < indexes.length; i++) {
        try {
            await pool.query(indexes[i], [])
            console.log("Index " + i + " created.")
        } catch (err) {
            console.log("Error creating index " + i + ".")
        }
    }

    await pool.end();
})()


// sudo -u postgres psql -c 'create database test;'