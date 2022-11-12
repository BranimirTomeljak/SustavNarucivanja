var express = require("express");
var router = express.Router();
const passport = require("passport");
const flash = require("express-flash");

router.get("/", checkAuthenticated, (req, res) => {
  // flash sets a messages variable. passport sets the error message
  console.log(req.session.flash.error);
  //res.render("login.ejs");
  res.redirect(401, "/login");
});

router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/patient",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("Logged in -> got another login request"); //nez sta ce nan ovo al aj
    return res.redirect(200, "/patient");
  }
  next();
}

module.exports = router;
