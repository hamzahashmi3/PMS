var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Password Management System' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Password Management System' });
});

router.get('/passwordcategory', function(req, res, next) {
  res.render('password_category', { title: 'Password Management System' });
});

router.get('/addnewcategory', function(req, res, next) {
  res.render('addNewCategory', { title: 'Password Management System' });
});

router.get('/addnewpassword', function(req, res, next) {
  res.render('addNewPassword', { title: 'Password Management System' });
});

router.get('/viewallpasswords', function(req, res, next) {
  res.render('viewAllPasswords', { title: 'Password Management System' });
});

module.exports = router;
