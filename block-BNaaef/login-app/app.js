var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo');
var flash = require('connect-flash');
var passport = require('passport');
var auth = require('./middlewares/auth');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var articlesRouter = require('./routes/articles');
var commentsRouter = require('./routes/comments');

mongoose.connect('mongodb://localhost/login-app', (err) => {
  console.log(err ? err : 'Database is connected successfully');
});
require('./modules/passport');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({ mongoUrl: 'mongodb://localhost/sampleLogin' }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(auth.userInfo);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/articles', articlesRouter);
app.use('/comments', commentsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
