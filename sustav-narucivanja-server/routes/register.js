var express = require("express");
const bcrypt = require("bcrypt");
const { pool } = require("../dbConfig");
const flash = require("express-flash");
var router = express.Router();
//import { checkAuthenticated, checkNotAuthenticated } from '../app.js';

/* GET users listing. */
router.get("/", checkAuthenticated, function (req, res, next) {
  //otic na stranicu
  //res.render ili nesto, pitat Marina kako ovo
});

/*router.post('/', function(req, res, next) {
  const data = {
    'mail': req.body.mail,
    'password': req.body.password,
    'repeatedPassword': req.body.repeatedPassword,
    'name': req.body.name,
    'surname': req.body.surname,
    'sex': req.body.sex,
    'phoneNumber': req.body.phoneNumber
  }
  res.json(data);
  console.log(req.body);
});*/

router.post("/", async (req, res) => {
  let {
    name,
    surname,
    sex,
    phoneNumber,
    mail,
    password,
    repeatedPassword,
    dateOfBirth,
    doctorId,
  } = req.body;

  let errors = [];

  console.log({
    name,
    surname,
    sex,
    phoneNumber,
    mail,
    password,
    repeatedPassword,
    dateOfBirth,
    doctorId,
  });

  if (
    !name ||
    !surname ||
    !sex ||
    !phoneNumber ||
    !mail ||
    !password ||
    !repeatedPassword ||
    !dateOfBirth ||
    !doctorId
  ) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
  }

  if (password !== repeatedPassword) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    console.log(errors);
  } else {
    hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    // Validation passed
    pool.query(
      `SELECT * FROM users
        WHERE mail = $1`,
      [mail],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          return res.render("register", {
            message: "mail already registered",
          });
        } else {
          pool.query(
            `INSERT INTO users (name,
              surname,
              sex,
              phoneNumber,
              mail,
              password,
              dateOfBirth,
              doctorId)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id, password`,
            [
              name,
              surname,
              sex,
              phoneNumber,
              mail,
              hashedPassword,
              dateOfBirth,
              doctorId,
            ],
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
              req.flash("success_msg", "You are now registered. Please log in");
              res.redirect("/login");
            }
          );
        }
      }
    );
  }
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/patient");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
