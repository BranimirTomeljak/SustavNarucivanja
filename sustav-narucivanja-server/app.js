
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var adminRouter = require('./routes/admin');
var patientRouter = require('./routes/patient');
var createRouter = require('./routes/create');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');

var app = express();


app.use('/admin', adminRouter);
app.use('/patient', patientRouter);
app.use('/create', createRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

console.log("starting...")
app.listen(3000)