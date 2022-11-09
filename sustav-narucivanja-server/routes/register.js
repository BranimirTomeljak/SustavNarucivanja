var express = require('express');
var router = express.Router();

/* GET users listing. */
/*router.get('/', function(req, res, next) {
  let jsonResponse = {
    "email": req.email,
    "password": "tomeljak",
    "repeatedPassword": "ante",
    "name": "ante",
    "surname": "ante",
    "sex": "ante",
    "phoneNumber": "ante"
  }
  console.log(req.body); //za dobit email sa frontenda
  res.json(req.body);
});*/

router.post('/', function(req, res, next) {
  const data = {
    'email': req.body.email,
    'password': req.body.password,
    'repeatedPassword': req.body.repeatedPassword,
    'name': req.body.name,
    'surname': req.body.surname,
    'sex': req.body.sex,
    'phoneNumber': req.body.phoneNumber
  }
  res.json(data);
  console.log(req.body);
});

module.exports = router;
