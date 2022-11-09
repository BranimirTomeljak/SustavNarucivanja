var createError = require("http-errors");
var express = require("express");
var path = require("path");
var app = express();

const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config();

//var cookieParser = require('cookie-parser');
//var logger = require('morgan');

const PORT = process.env.PORT || 3000;

const initializePassport = require("./passportConfig");
initializePassport(passport);

var adminRouter = require("./routes/admin");
var patientRouter = require("./routes/patient");
var createRouter = require("./routes/create");
var loginRouter = require("./routes/login");
var registerRouter = require("./routes/register");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
//app.use(logger('dev'));
//app.use(cookieParser());

app.use("/admin", adminRouter);
app.use("/patient", patientRouter);
app.use("/create", createRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);

app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: process.env.SESSION_SECRET,
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // Save empty value if there is no vaue which we do not want to do
    saveUninitialized: false,
  })
);
// Funtion inside passport which initializes passport
app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());
app.use(flash());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.get('/logout', (req, res) => {
  req.logOut(function(err){
      if(err){ return next(err); }
      req.flash("success_msg", "You have logged out");
      res.redirect('/users/login');
  });
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

//export {checkAuthenticated, checkNotAuthenticated};

module.exports = app;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
