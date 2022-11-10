var express = require("express");
const passport = require("passport");
const flash = require("express-flash");
var router = express.Router();

router.get("/", checkAuthenticated, (req, res) => {
  // flash sets a messages variable. passport sets the error message
  console.log(req.session.flash.error);
  //res.render("login.ejs");
});

router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/patient",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

function checkAuthenticated(req, res, next) { // ne ulazi uopce
  console.log("jesan pajdo");
  if (req.isAuthenticated()) {
    console.log("jesan pajdo");
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
