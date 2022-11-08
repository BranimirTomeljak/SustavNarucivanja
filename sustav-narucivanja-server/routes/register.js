var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let jsonResponse = {
    "email": req.email,
    "password": "tomeljak",
    "repeatedPassword": "ante",
    "name": "ante",
    "surname": "ante",
    "sex": "ante",
    "phoneNumber": "ante"
  }
  console.log(req.headers); //za dobit email sa frontenda
  res.json(req.body);
});

module.exports = router;
