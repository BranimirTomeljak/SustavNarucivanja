var express = require("express");
var router = express.Router();
const { pool } = require("../db/dbConfig");
const passport = require("passport");
const flash = require("express-flash");

/*router.get("/", checkAuthenticated, (req, res) => {  //zasad nek stoji komentirano ali tribat ce nan posli (kad pokusavamo pristupit login pageu, a vec smo logirani)
  // flash sets a messages variable. passport sets the error message  
  console.log(req.session.flash.error);
  //res.render("login.ejs");
  res.sendStatus(401);
});*/

router.post(
  "/",
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
        }
        res.end(JSON.stringify(results.rows));
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
