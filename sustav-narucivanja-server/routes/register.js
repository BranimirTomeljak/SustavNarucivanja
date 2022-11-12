var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const { pool } = require("../db/dbConfig");
const flash = require("express-flash");

//import { checkAuthenticated, checkNotAuthenticated } from '../app.js';

router.post("/", async (req, res) => {
  let {
    name,
    surname,
    sex,
    phoneNumber,
    mail,
    password,
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
    !dateOfBirth ||
    !doctorId
  ) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
  }

  /*if(phoneNumber.length !== 9 || phoneNumber.length !== 10) {
    errors.push({ message: "Croatian phone number must have 9 or 10 digits" });
  }*/

  if (errors.length > 0) {
    console.log(errors);
    res.redirect(400, "/register"); // dodat da se ispisu errori na frontendu
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
          console.log("mail already registered");
          res.redirect(400, "/register");
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
              res.redirect(200,"/login");
            }
          );
        }
      }
    );
  }
});

module.exports = router;