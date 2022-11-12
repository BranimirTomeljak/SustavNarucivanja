var express = require('express');
var router = express.Router();
const flash = require("express-flash");

router.get('/', (req, res) => {
    req.logOut(function(err){
        if(err){ return next(err); }
        req.flash("success_msg", "You have logged out");
        res.redirect('/login');
    });
  });

module.exports = router;
