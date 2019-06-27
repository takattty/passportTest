var express = require('express');
var router = express.Router();

var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user : req.user });
});

router.get('/login', function(req, res) {
  res.render('login', { user : req.user });
});


//ここから認証に関するルートの設定を行う。
//適切に認証されたら、/にリダイレクトし、認証失敗なら/loginにリダイレクトする設定。
//要は、認証のメソッドを使ってページ間のリダイレクトを書いている。
router.post('/login', passport.authenticate('local',
  {successRedirect: '/',
  failureRedirect: '/login',
  session: false}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


module.exports = router;
