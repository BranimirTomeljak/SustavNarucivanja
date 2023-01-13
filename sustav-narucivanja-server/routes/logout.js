var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  req.logOut(function (err) {
    if (err) {
      console.log("could not log out");
      return next(err);
    }
    req.flash("success_msg", "You have logged out");
    res.clearCookie("id");
    res.json({ message: "You have logged out" });
  });
});

module.exports = router;
