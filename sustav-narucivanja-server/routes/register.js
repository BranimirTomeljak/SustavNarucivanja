var express = require("express");
const bcrypt = require("bcrypt");
const { pool } = require("../dbConfig");
const flash = require("express-flash");
var router = express.Router();
//import { checkAuthenticated, checkNotAuthenticated } from '../app.js';

router.get("/", checkAuthenticated, function (req, res, next) {
  //otic na stranicu
  //res.render ili nesto, pitat Marina kako ovo
});


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
  /*if(phoneNumber.length !== 9 || phoneNumber.length !== 10) {
    errors.push({ message: "Croatian phone number must have 9 or 10 digits" });
  }*/

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
          //return res.render("register", {message: "mail already registered",});
          console.log("mail already registered");
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
