var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get("/patient", checkNotAuthenticated, (req, res) => {
  console.log("oce to");
  console.log(req.isAuthenticated());
  //res.render("dashboard", { user: req.user.name });
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
