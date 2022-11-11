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


const sql_create_users = `CREATE TABLE users
(
  id INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR NOT NULL,
  surname VARCHAR NOT NULL,
  phoneNumber VARCHAR NOT NULL,
  mail VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  sex VARCHAR NOT NULL,
  dateOfBirth DATE NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (phoneNumber),
  UNIQUE (mail) )`;

const sql_create_admin = `CREATE TABLE Admin
(
  adminid INT NOT NULL,
  PRIMARY KEY (adminid),
  FOREIGN KEY (adminid) REFERENCES users(id)
)`;

const sql_create_patient = `CREATE TABLE patient
(
  numberOfMissedApp INT NOT NULL,
  patientid INT NOT NULL,
  doctorid INT NOT NULL,
  PRIMARY KEY (patientid),
  FOREIGN KEY (patientid) REFERENCES users(id),
  FOREIGN KEY (doctorid) REFERENCES doctor(doctorid)
)`;

const sql_create_doctor = `CREATE TABLE doctor(
  doctorid INT NOT NULL,
  PRIMARY KEY (doctorid),
  FOREIGN KEY (doctorid) REFERENCES users(id)
)`;

const sql_create_nurse = `CREATE TABLE nurse
(
  nurseid INT NOT NULL,
  teamName VARCHAR,
  PRIMARY KEY (nurseid),
  FOREIGN KEY (nurseid) REFERENCES users(id),
  FOREIGN KEY (teamName) REFERENCES team(teamName)
)`;

const sql_create_team = `CREATE TABLE team
(
  teamName VARCHAR NOT NULL,
  doctorid INT,
  PRIMARY KEY (teamName),
  FOREIGN KEY (doctorid) REFERENCES doctor(doctorid)
)`;

const sql_create_appointment = `CREATE TABLE appointment (
    appointmentId int  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patientid INT NOT NULL,
    doctorid INT,
    nurseid INT,
    time TIMESTAMP,
    duration INTERVAL, 
    FOREIGN KEY (patientid) REFERENCES patient(patientid),
    FOREIGN KEY (doctorid) REFERENCES doctor(doctorid),
    FOREIGN KEY (nurseid) REFERENCES nurse(nurseid))`; // TODO fix duration


const sql_insert_users = `INSERT INTO users (name, surname, sex, phoneNumber, mail, password, dateOfBirth)
    VALUES 
    ('Branet', 'Tomeljak', 'F', '0955995084', 'branet@gmail.com', 'idegas', '1950-1-1'),
    ('Lara', 'Novak', 'Z', '0981012013', 'LaraNovak0@gmail.com', '11112013', '1938-7-18'),
('Kiara', 'Sabolovic', 'Z', '0981012014', 'KiaraSabolovic1@gmail.com', '11122014', '1992-12-1'),
('Gaspar', 'Siljeg', 'M', '0971012015', 'GasparSiljeg2@gmail.com', '11132015', '1991-8-19'),
('Grgur', 'Stipetic', 'M', '0961012016', 'GrgurStipetic3@gmail.com', '11142016', '1938-6-22'),
('Zrin', 'Slunjski', 'M', '0991012017', 'ZrinSlunjski4@gmail.com', '11152017', '1964-4-9'),
('Tim', 'Tomic', 'M', '0991012018', 'TimTomic5@gmail.com', '11162018', '1960-6-3'),
('Tomislav', 'Kovacevic', 'M', '0941012019', 'TomislavKovacevic6@gmail.com', '11172019', '1976-4-2'),
('Gia', 'Petrovic', 'Z', '0951012020', 'GiaPetrovic7@gmail.com', '11182020', '1968-4-2'),
('Lidija', 'Simic', 'Z', '0991012021', 'LidijaSimic8@gmail.com', '11192021', '1978-1-23'),
('Mihaela', 'Zuvela', 'Z', '0941012022', 'MihaelaZuvela9@gmail.com', '11202022', '1929-8-23'),
('Viktor', 'Petrovic', 'M', '0941012023', 'ViktorPetrovic10@gmail.com', '11212023', '1968-3-21'),
('Leonida', 'Tomasic', 'Z', '0991012024', 'LeonidaTomasic11@gmail.com', '11222024', '1967-6-9'),
('Zrinislav', 'Terzic', 'M', '0971012025', 'ZrinislavTerzic12@gmail.com', '11232025', '1948-4-2'),
('Mada', 'Babic', 'Z', '0911012026', 'MadaBabic13@gmail.com', '11242026', '1940-10-23'),
('Paloma', 'Sabolovic', 'Z', '0931012027', 'PalomaSabolovic14@gmail.com', '11252027', '1973-4-1'),
('Artur', 'Tominac', 'M', '0961012028', 'ArturTominac15@gmail.com', '11262028', '1988-12-23'),
('Alfi', 'Novak', 'M', '0951012029', 'AlfiNovak16@gmail.com', '11272029', '1960-4-11'),
('Juna', 'Sabolovic', 'Z', '0971012030', 'JunaSabolovic17@gmail.com', '11282030', '1957-6-21'),
('Lan', 'Kovacevic', 'M', '0941012031', 'LanKovacevic18@gmail.com', '11292031', '1997-8-5'),
('Tihana', 'Tudoric-Gemo', 'Z', '0991012032', 'TihanaTudoric-Gemo19@gmail.com', '11302032', '1991-5-20'),
('Marta', 'Tartaglia', 'Z', '0981012033', 'MartaTartaglia20@gmail.com', '11312033', '1979-4-9'),
('Goran', 'Tomasic', 'M', '0941012034', 'GoranTomasic21@gmail.com', '11322034', '1984-6-21'),
('Katica', 'Stipetic', 'Z', '0981012035', 'KaticaStipetic22@gmail.com', '11332035', '1983-4-3'),
('Neven', 'Susak', 'M', '0931012036', 'NevenSusak23@gmail.com', '11342036', '2000-3-28'),
('Zlatomir', 'Tudoric-Gemo', 'M', '0951012037', 'ZlatomirTudoric-Gemo24@gmail.com', '11352037', '1987-11-12'),
('Gradislav', 'Saric', 'M', '0921012038', 'GradislavSaric25@gmail.com', '11362038', '1951-3-11'),
('Oskar', 'Zuvela', 'M', '0971012039', 'OskarZuvela26@gmail.com', '11372039', '1985-6-25'),
('Bena', 'Spajic', 'Z', '0921012040', 'BenaSpajic27@gmail.com', '11382040', '1938-7-1'),
('Chaja', 'Tominac', 'Z', '0921012041', 'ChajaTominac28@gmail.com', '11392041', '1950-3-21'),
('Adriel', 'Simic', 'M', '0951012042', 'AdrielSimic29@gmail.com', '11402042', '1994-9-16'),
('Kalani', 'Skific', 'Z', '0941012043', 'KalaniSkific30@gmail.com', '11412043', '1962-2-20'),
('Naja', 'Tomasic', 'Z', '0991012044', 'NajaTomasic31@gmail.com', '11422044', '1979-2-26'),
('Antonela', 'Sunjo', 'Z', '0931012045', 'AntonelaSunjo32@gmail.com', '11432045', '1954-7-16'),
('Ane', 'Sneberger', 'Z', '0921012046', 'AneSneberger33@gmail.com', '11442046', '1989-2-17'),
('Neba', 'Skok', 'Z', '0941012047', 'NebaSkok34@gmail.com', '11452047', '1949-1-7'),
('Alen', 'Siljeg', 'M', '0971012048', 'AlenSiljeg35@gmail.com', '11462048', '1951-1-5'),
('Bartol', 'Sepic', 'M', '0941012049', 'BartolSepic36@gmail.com', '11472049', '1993-6-26'),
('Mario', 'Tomasic', 'M', '0921012050', 'MarioTomasic37@gmail.com', '11482050', '1979-7-11'),
('Arijela', 'Stipetic', 'Z', '0941012051', 'ArijelaStipetic38@gmail.com', '11492051', '1972-6-24'),
('Iko', 'Maric', 'M', '0911012052', 'IkoMaric39@gmail.com', '11502052', '1996-12-24'),
('Darije', 'Maric', 'M', '0961012053', 'DarijeMaric40@gmail.com', '11512053', '1995-5-15'),
('Leo', 'Zeljko', 'M', '0971012054', 'LeoZeljko41@gmail.com', '11522054', '1940-2-9'),
('Zorka', 'Zovko', 'Z', '0991012055', 'ZorkaZovko42@gmail.com', '11532055', '1987-2-12'),
('Drazenka', 'Tominac', 'Z', '0911012056', 'DrazenkaTominac43@gmail.com', '11542056', '1962-7-28'),
('Anika', 'Novak', 'Z', '0911012057', 'AnikaNovak44@gmail.com', '11552057', '2000-7-5'),
('Lina', 'Babic', 'Z', '0931012058', 'LinaBabic45@gmail.com', '11562058', '1979-5-23'),
('Iko', 'Sepic', 'M', '0961012059', 'IkoSepic46@gmail.com', '11572059', '1998-7-14'),
('Izabela', 'Tominac', 'Z', '0951012060', 'IzabelaTominac47@gmail.com', '11582060', '1987-2-1'),
('Lidija', 'Tudoric-Gemo', 'Z', '0931012061', 'LidijaTudoric-Gemo48@gmail.com', '11592061', '1990-6-15'),
('Ezekiel', 'Maric', 'M', '0991012062', 'EzekielMaric49@gmail.com', '11602062', '1955-9-5'),
('Azalea', 'Sebalj', 'Z', '0971012063', 'AzaleaSebalj50@gmail.com', '11612063', '1991-4-10'),
('Karolina', 'Vrankovic', 'Z', '0991012064', 'KarolinaVrankovic51@gmail.com', '11622064', '1969-8-8'),
('Amanda', 'Knezevic', 'Z', '0941012065', 'AmandaKnezevic52@gmail.com', '11632065', '1961-5-19'),
('Lav', 'Zovko', 'M', '0941012066', 'LavZovko53@gmail.com', '11642066', '1953-7-9'),
('Marcela', 'Sabolovic', 'Z', '0981012067', 'MarcelaSabolovic54@gmail.com', '11652067', '1993-5-5'),
('Lorena', 'Senjanovic', 'Z', '0961012068', 'LorenaSenjanovic55@gmail.com', '11662068', '2001-1-20'),
('Sebastijan', 'Sertic', 'M', '0941012069', 'SebastijanSertic56@gmail.com', '11672069', '1954-4-4'),
('Parka', 'Zeljko', 'Z', '0981012070', 'ParkaZeljko57@gmail.com', '11682070', '1930-2-24'),
('Elivija', 'Slunjski', 'Z', '0971012071', 'ElivijaSlunjski58@gmail.com', '11692071', '1951-11-8'),
('Gradislav', 'Vukovic', 'M', '0921012072', 'GradislavVukovic59@gmail.com', '11702072', '2000-9-14'),
('Jema', 'Sunjo', 'Z', '0981012073', 'JemaSunjo60@gmail.com', '11712073', '1982-5-8'),
('Bianka', 'Zeljko', 'Z', '0951012074', 'BiankaZeljko61@gmail.com', '11722074', '1970-12-21'),
('Vita', 'Stuban', 'Z', '0931012075', 'VitaStuban62@gmail.com', '11732075', '1929-3-17'),
('Eugen', 'Zuvela', 'M', '0991012076', 'EugenZuvela63@gmail.com', '11742076', '1983-11-18'),
('Tiana', 'Tomic', 'Z', '0931012077', 'TianaTomic64@gmail.com', '11752077', '1984-1-11'),
('Kora', 'Saric', 'Z', '0981012078', 'KoraSaric65@gmail.com', '11762078', '1986-4-28'),
('Lidija', 'Knezevic', 'Z', '0971012079', 'LidijaKnezevic66@gmail.com', '11772079', '1996-7-22'),
('Valerija', 'Simic', 'Z', '0971012080', 'ValerijaSimic67@gmail.com', '11782080', '1955-2-9'),
('Frida', 'Sneberger', 'Z', '0971012081', 'FridaSneberger68@gmail.com', '11792081', '1956-10-12'),
('Lilian', 'Vukelici', 'Z', '0921012082', 'LilianVukelici69@gmail.com', '11802082', '1984-12-8'),
('Leila', 'Slunjski', 'Z', '0971012083', 'LeilaSlunjski70@gmail.com', '11812083', '1983-11-16'),
('Ana', 'Slunjski', 'Z', '0921012084', 'AnaSlunjski71@gmail.com', '11822084', '1937-10-10'),
('Gvozden', 'Maric', 'M', '0981012085', 'GvozdenMaric72@gmail.com', '11832085', '1975-9-6'),
('Oto', 'Zeljko', 'M', '0931012086', 'OtoZeljko73@gmail.com', '11842086', '1949-12-16'),
('Majin', 'Saric', 'M', '0931012087', 'MajinSaric74@gmail.com', '11852087', '1971-5-8'),
('Vjeko', 'Tokic', 'M', '0941012088', 'VjekoTokic75@gmail.com', '11862088', '1947-7-5'),
('Ozren', 'Sunjo', 'M', '0951012089', 'OzrenSunjo76@gmail.com', '11872089', '1992-5-13'),
('Adam', 'Kovacevic', 'M', '0951012090', 'AdamKovacevic77@gmail.com', '11882090', '1981-12-18'),
('Drzislav', 'Simic', 'M', '0981012091', 'DrzislavSimic78@gmail.com', '11892091', '1991-2-23'),
('Zahra', 'Babic', 'Z', '0981012092', 'ZahraBabic79@gmail.com', '11902092', '1949-8-2'),
('Helga', 'Vukelici', 'Z', '0941012093', 'HelgaVukelici80@gmail.com', '11912093', '1988-9-24'),
('Fabijan', 'Kovacevic', 'M', '0921012094', 'FabijanKovacevic81@gmail.com', '11922094', '1993-12-28'),
('Ezra', 'Stuban', 'Z', '0991012095', 'EzraStuban82@gmail.com', '11932095', '1935-7-18'),
('Pavao', 'Zlataric', 'M', '0921012096', 'PavaoZlataric83@gmail.com', '11942096', '2000-10-11'),
('Jolena', 'Zovko', 'Z', '0931012097', 'JolenaZovko84@gmail.com', '11952097', '1964-9-20'),
('Zola', 'Sunjo', 'Z', '0991012098', 'ZolaSunjo85@gmail.com', '11962098', '1985-8-23'),
('Amira', 'Skific', 'Z', '0911012099', 'AmiraSkific86@gmail.com', '11972099', '1972-10-9'),
('Lobel', 'Juric', 'M', '0971012100', 'LobelJuric87@gmail.com', '11982100', '1995-1-20'),
('Milana', 'Tominac', 'Z', '0981012101', 'MilanaTominac88@gmail.com', '11992101', '1976-4-17'),
('Tihomir', 'Skok', 'M', '0971012102', 'TihomirSkok89@gmail.com', '12002102', '1958-5-11'),
('Izabela', 'Skok', 'Z', '0981012103', 'IzabelaSkok90@gmail.com', '12012103', '1999-7-5'),
('Arabela', 'Zeljko', 'Z', '0961012104', 'ArabelaZeljko91@gmail.com', '12022104', '1941-3-17'),
('Oto', 'Vukovic', 'M', '0931012105', 'OtoVukovic92@gmail.com', '12032105', '1986-10-13'),
('Mabela', 'Sertic', 'Z', '0931012106', 'MabelaSertic93@gmail.com', '12042106', '1933-2-24'),
('Sebastijan', 'Slunjski', 'M', '0961012107', 'SebastijanSlunjski94@gmail.com', '12052107', '1941-10-1'),
('Klo', 'Juric', 'Z', '0971012108', 'KloJuric95@gmail.com', '12062108', '1975-6-23'),
('Vladimir', 'Tudoric-Gemo', 'M', '0971012109', 'VladimirTudoric-Gemo96@gmail.com', '12072109', '1998-9-11'),
('Ljubica', 'Spajic', 'Z', '0921012110', 'LjubicaSpajic97@gmail.com', '12082110', '1953-10-14'),
('Ezra', 'Siljeg', 'Z', '0951012111', 'EzraSiljeg98@gmail.com', '12092111', '1984-4-24'),
('Rila', 'Kovacic', 'Z', '0941012112', 'RilaKovacic99@gmail.com', '12102112', '1975-12-22'),
('Elana', 'Tominac', 'Z', '0971012113', 'ElanaTominac100@gmail.com', '12112113', '1981-9-10'),
('Donat', 'Sneberger', 'M', '0991012114', 'DonatSneberger101@gmail.com', '12122114', '1944-4-19'),
('Disa', 'Horvat', 'Z', '0941012115', 'DisaHorvat102@gmail.com', '12132115', '1946-10-27')`;

const sql_insert_nurse = `INSERT INTO nurse (nurseid, teamName) VALUES (8, 'One'), (10, 'Two'), (12, 'Three'), 
(14, 'Four'), (16, NULL)`
const sql_insert_patient = `INSERT INTO patient (numberOfMissedApp, patientid, doctorid) VALUES (0, 100, 7), (0, 101, 7), 
(0, 102, 7)`
const sql_insert_admin = `INSERT INTO admin (adminid) VALUES (2), (3), (5)`
const sql_insert_doctor = `INSERT INTO doctor (doctorid) VALUES (7), (9), (11), (13), (15)`
const sql_insert_team = `INSERT INTO team (teamName) VALUES ('One'), ('Two'), ('Three'), ('Four'), ('Five')`

const sql_insert_appointments = `INSERT INTO appointment (patientid, doctorid, nurseid, time, duration) VALUES 
    (100, 7, NULL, '2015-01-10 00:51:14', '00:20:00'),
    (101, 7, NULL, '2015-01-10 01:51:14', '00:20:00'),
    (101, 9, NULL, '2015-01-10 01:51:14', '00:20:00'),
    (101, 7, NULL, '2015-01-10 22:00:14', '02:20:00')
`


let table_names = [
    "users",
    "admin",
    "doctor",
    "patient",
    "team",
    "nurse",
    "appointment"
]

let tables = [
    sql_create_users,
    sql_create_admin,
    sql_create_doctor,
    sql_create_patient,
    sql_create_team,
    sql_create_nurse,
    sql_create_appointment,
];

let table_data = [
    sql_insert_users,
    sql_insert_admin,
    sql_insert_doctor,
    sql_insert_patient,
    sql_insert_team,
    sql_insert_nurse,
    sql_insert_appointments,
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