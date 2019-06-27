var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

console.log('Server Start!');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//セッションミドルウェアの設定
app.use(session({ resave:false,seveUninitialized:false, secret: 'passport test'}));
app.use(passport.initialize());
app.use(passport.session());
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',//この２つは、login.jadeのform-controlと同じにしないといけない。
  passReqToCallback: true,
  session: false,
}, function (req, username, password, done) {
  process.nextTick(function () {
    //ここから下で認証の成功条件を指定。
    if (username === "test" && password === "test") {
      return done(null, username)//成功した場合、doneメソッドでpassportに対して成功を伝える。このusernameがpassport.serializaUser関数のコールバック関数の第一引数に渡る。
    } else {
      console.log("login error")
      return done(null, false, { message: 'パスワードが正しく有りません' })
    }
  })
}));

passport.serializeUser(function (user, done) {
    done(null, user);//この関数でシリアライズして保存される。
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

//この下の2つよりも上にpassportの処理を書かないとエラーが発生してしまうそう。
app.use('/', indexRouter);
app.use('/users', usersRouter);

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
