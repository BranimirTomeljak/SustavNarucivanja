var express = require("express");
var router = express.Router();
const { pool } = require("../db/dbConfig");
const passport = require("passport");
const flash = require("express-flash");
const { json } = require("express");

/*router.get("/", checkAuthenticated, (req, res) => {  //zasad nek stoji komentirano ali tribat ce nan posli (kad pokusavamo pristupit login pageu, a vec smo logirani)
  // flash sets a messages variable. passport sets the error message  
  console.log(req.session.flash.error);
  //res.render("login.ejs");
  res.sendStatus(401);
});*/

router.post( "/",
  passport.authenticate("local", { failureFlash: true }),
  function (req, res) {
    let { mail } = req.body;
    pool.query(
      `SELECT * FROM users
        WHERE mail = $1`,
      [mail],
      (err, results) => {
        if (err) {
          console.log(err);
          res.sendStatus(404);
        }
        res.cookie("id", results.rows[0].id, { maxAge: 5184000000 }); //nakon 60 dana se cookie briše, standardna sigurnosna mjera
        res.json(results.rows[0]);
      }
    );
  }
);

/*function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("Logged in -> got another login request"); //nez sta ce nan ovo al aj
    return res.sendStatus(200);
  }
  next();
}*/

module.exports = router;
