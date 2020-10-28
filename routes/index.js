var express = require('express');
var router = express.Router();
var bcrypt =require('bcrypt');
var jwt = require('jsonwebtoken');
var userModule = require('../moodules/user')
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/PMS",{useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});



/* GET home page. */

// if (typeof localStorage === "undefined" || localStorage === null) {
//   var LocalStorage = require('node-localstorage').LocalStorage;
//   localStorage = new LocalStorage('./scratch');
// }

function checkUserName(req,res,next){
  var username = req.body.uname;
  var checkUserName=userModule.findOne({username:username});
  checkUserName.exec((err,data)=>{
 if(err) throw err;
 if(data){ return res.render('signup', { title: 'Password Management System', msg:'Username Already Exit' });}
 next();
  }); }


function checkEmail(req,res,next){
  var email=req.body.email;
  var checkexitemail=userModule.findOne({email:email});
  checkexitemail.exec((err,data)=>{
 if(err) throw err;
 if(data){ return res.render('signup', { title: 'Password Management System', msg:'Email Already Exit' }); }
 next();
  }); }


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Password Management System', msg:'' });
});
router.post('/', function(req, res, next) {
var username = req.body.username;
var password = req.body.password;
var checkuser = userModule.findOne({username:username});
checkuser.exec((err,data)=>{
  if(err)throw err;
  var getpassword = data.password;
  if(bcrypt.compareSync(password, getpassword)){
    res.render('index', { title: 'Password Management System', msg:'user logged in successfully' });
  }else{
    res.render('index', { title: 'Password Management System', msg:'invalid username or password' });
  }
})
});



router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Password Management System' ,msg:''});
});

  router.post('/signup',checkEmail, checkUserName, function(req, res, next) {
  console.log(req.body)
  var username = req.body.uname;
  var email = req.body.Email;
  var password = req.body.password;
  var confpassword = req.body.confpassword;
  if(password!=confpassword){
    res.render('signup', { title: 'Password Management System', msg: 'Password Does not match!'});
  }else{
    password= bcrypt.hashSync(password,10)
    var userDetails=new userModule({
      username:username,
      email:email,
      password:password
    });
    userDetails.save((err,doc)=>{
    if(err) throw err;
    res.render('signup', { title: 'Password Management System', msg: 'User Registerd Successfully'});
    })  ;
    
  }

 
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
