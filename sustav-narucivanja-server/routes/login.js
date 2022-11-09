var express = require("express");
const passport = require("passport");
var router = express.Router();

/* GET users listing. */
router.get("/", checkAuthenticated, (req, res) => {
  // flash sets a messages variable. passport sets the error message
  console.log(req.session.flash.error);
  //res.render("login.ejs");
});

/*router.post('/', function(req, res, next) {
  const data = {
    'email': req.headers.email,
    'password': req.headers.password
  }
  res.json(data);
});*/

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
