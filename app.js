var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var env = require("dotenv");
const cors = require("cors");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require("./routes/auth/auth");
var businessRegRoute = require("./routes/businessRegRoute");
var categoryRoute = require("./routes/categoryRoute");

env.config();
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'vendorImages')));
const directory = path.join(__dirname, 'vendorImages');
app.use('/vendorImages', express.static(directory));
const directoryManual = path.join(__dirname, 'vendorManualImages');
app.use('/vendorManualImages', express.static(directoryManual));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/api",authRouter);
app.use("/api",businessRegRoute);
app.use("/api",categoryRoute);

// mongoose.connect('mongodb://localhost:27017/albi').then(()=>{
mongoose.connect('mongodb+srv://ecommdemo:demoecomm123@cluster0.e9dtobc.mongodb.net/albi').then(()=>{
  console.log("Database connected...");
});

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
