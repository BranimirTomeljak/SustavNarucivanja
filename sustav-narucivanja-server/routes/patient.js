var express = require('express');
var router = express.Router();

router.get("/", checkNotAuthenticated, (req, res) => {
  console.log(req.isAuthenticated());
  res.redirect(200, "/patient");
});

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect(401, "/login");
}

module.exports = router;
