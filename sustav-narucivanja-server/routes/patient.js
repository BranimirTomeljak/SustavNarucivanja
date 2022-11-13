var express = require('express');
var router = express.Router();

router.get("/", checkNotAuthenticated, (req, res) => {
  console.log(req.isAuthenticated());
  res.sendStatus(200);
});

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
}

module.exports = router;
