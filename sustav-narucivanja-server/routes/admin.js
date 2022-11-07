var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let jsonResponse = {
    "email": "ante",
    "password": "tomeljak",
    "repeatedPassword": "ante",
    "name": "ante",
    "surname": "ante",
    "sex": "ante",
    "phoneNumber": "ante"
  }
  res.json(jsonResponse);
});

module.exports = router;
