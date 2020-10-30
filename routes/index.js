var express = require('express');
var router = express.Router();
var bcrypt =require('bcrypt');
var jwt = require('jsonwebtoken');
var userModule = require('../moodules/user')
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/PMS",{useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});



/* GET home page. */

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function checkLoginUser (req, res, next){
  var userToken = localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/')
  }
  next();
}

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
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('/dashboard');
  }else{
    res.render('index', { title: 'Password Management System', msg:'' });
  }
});
router.post('/', function(req, res, next) {
var username = req.body.username;
var password = req.body.password;
var checkuser = userModule.findOne({username:username});
checkuser.exec((err,data)=>{
  if(err)throw err;
  var getpassword = data.password;
  var getuserid = data._id;
  if(bcrypt.compareSync(password, getpassword)){
    var token = jwt.sign({ userId: getuserid }, 'loginToken');
    localStorage.setItem('userToken', token);
    localStorage.setItem('loginUser', username);
   res.redirect('/dashboard');
  }else{
    res.render('index', { title: 'Password Management System', msg:'invalid username or password' });
  }
})
});


router.get('/dashboard',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  console.log(loginUser );
  res.render('dashboard', { title: 'Password Management System' ,loginUser:loginUser, msg:''});
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

router.get('/passwordcategory', checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  res.render('password_category', { title: 'Password Management System', loginUser:loginUser });
});

router.get('/addnewcategory', checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  res.render('addNewCategory', { title: 'Password Management System', loginUser:loginUser  });
});

router.get('/addnewpassword', checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  res.render('addNewPassword', { title: 'Password Management System', loginUser:loginUser  });
});

router.get('/viewallpasswords', checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  res.render('viewAllPasswords', { title: 'Password Management System', loginUser:loginUser  });
});

router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});
module.exports = router;
