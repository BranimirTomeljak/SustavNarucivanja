process.on("uncaughtException", function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var app = express();

const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const initializePassport = require("./db/passportConfig");
initializePassport(passport);

var appointmentRouter = require("./routes/appointment");
var teamRouter = require("./routes/team");
var patientRouter = require("./routes/patient");
var loginRouter = require("./routes/login");
var registerRouter = require("./routes/register");
var logoutRouter = require("./routes/logout");
var doctorRouter = require("./routes/doctor");
var nurseRouter = require("./routes/nurse");
var userRouter = require("./routes/user");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET, // Key we want to keep secret which will encrypt all of our information
    resave: false, // Should we resave our session variables if nothing has changes which we dont
    saveUninitialized: false, // Save empty value if there is no vaue which we do not want to do
  })
);
app.use(passport.initialize()); // Function inside passport which initializes passport
app.use(passport.session()); // Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(flash());
app.use(cookieParser());

app.use("/api/patient", patientRouter);
app.use("/api/login", loginRouter);
app.use("/api/register", registerRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/appointment", appointmentRouter);
app.use("/api/patient", patientRouter);
app.use("/api/team", teamRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/nurse", nurseRouter);
app.use("/api/user", userRouter);

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
});

module.exports = app;

app.listen(PORT, "0.0.0.0", function () {
  console.log("Listening to port:  " + PORT);
});
