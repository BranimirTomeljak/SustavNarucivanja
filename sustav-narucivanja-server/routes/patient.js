var express = require('express');
var router = express.Router();

router.get("/", checkNotAuthenticated, (req, res) => {
  console.log(req.isAuthenticated());
  //res.render("dashboard", { user: req.user.name });
});

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
