var express = require('express');
var router = express.Router();

/* GET users listing. */
/*router.get('/', function(req, res, next) {
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
});*/

router.post('/', function(req, res, next) {
  const data = {
    'email': req.headers.email,
    'password': req.headers.password
  }
  res.json(data);
});

module.exports = router;
