var express = require("express");
var router = express.Router();
const passport = require("passport");
const flash = require("express-flash");

router.get("/", checkAuthenticated, (req, res) => {
  // flash sets a messages variable. passport sets the error message
  console.log(req.session.flash.error);
  //res.render("login.ejs");
  res.sendStatus(401);
});

router.post(
  "/",
  passport.authenticate("local", { failureFlash: true }),
  function (req, res) {
    res.sendStatus(200);
  }
);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("Logged in -> got another login request"); //nez sta ce nan ovo al aj
    return res.sendStatus(200);
  }
  next();
}

module.exports = router;
