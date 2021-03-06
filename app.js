var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

// app.use(function (req, res) {
//   res.setHeader('Content-Type', 'text/plain')
//   res.write('you posted:\n')
//   res.end(JSON.stringify(req.body))
// })



var usersRouter = require('./routes/users');
var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');
var addnewcategoryRouter = require('./routes/addnewcategory');
var passwordcategoryRouter = require('./routes/passwordcategory');
var addnewpasswordRouter = require('./routes/addnewpassword');
var viewallpasswordsRouter = require('./routes/viewallpasswords');
var passwordDetailRouter = require('./routes/password-detail');

app.use('/password-detail', passwordDetailRouter);
app.use('/viewallpasswords', viewallpasswordsRouter);
app.use('/addnewpassword', addnewpasswordRouter);
app.use('/passwordcategory', passwordcategoryRouter);
app.use('/addnewcategory', addnewcategoryRouter);
app.use('/dashboard', dashboardRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);

//catch 404 and forward to error handler
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
