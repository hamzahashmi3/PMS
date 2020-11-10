var express = require('express');
var router = express.Router();
var bcrypt =require('bcrypt');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
var userModule = require('../moodules/user');
var PasswordCategoryModel = require('../moodules/passwordCategory');
var getPassCat = PasswordCategoryModel.find({});
var passwordDetailModel = require('../moodules/addPassword');
var getAllPass = passwordDetailModel.find({});
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

router.get('/addnewcategory', checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser'); 
    res.render('addNewCategory', { title: 'Password Management System', loginUser:loginUser, errors:'', success:""});
});

router.post('/addnewcategory', checkLoginUser, [
    check('Newcategory', 'pasword must be of at-least 5 characters').isLength({ min: 5 })],
    function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors.mapped())
        res.render('addNewCategory', { title: 'Password Management System', loginUser:loginUser, errors:errors.mapped(), success:""  });
      }else{
        var PasswordCatName = req.body.Newcategory;
        var passwordDetails = new PasswordCategoryModel({
          password_category : PasswordCatName
        })
        passwordDetails.save((err,doc)=>{
          if(err) throw err;
          res.render('addNewCategory', { title: 'Password Management System', loginUser:loginUser, errors:'', success:"password category added successfully"  });
          })
    }
  });

router.get('/passwordcategory', checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  getPassCat.exec(function(err,data){
    if(err) throw  err;
    res.render('password_category', { title: 'Password Management System', loginUser:loginUser, records: data });
});
});

router.get('/passwordcategory/delete/:id', checkLoginUser, function(req, res, next) {
  var passId = req.params.id;
  var passdelete = PasswordCategoryModel.findByIdAndDelete(passId);
   passdelete.exec((err)=>{
    if(err) throw  err;
      res.redirect('/passwordcategory');
  });
});

router.get('/passwordcategory/edit/:id', checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var passId = req.params.id;
  var passEdit = PasswordCategoryModel.findById(passId)
  passEdit.exec((err,data)=>{
    if(err) throw  err;
    res.render('editPassCategory', { title: 'Password Management System', loginUser:loginUser, errors:'', success:'',id:passId , records: data });
  });
});

router.post('/passwordcategory/edit', checkLoginUser, function(req, res, next) {
  var passId = req.body.edit_id;
  var passEditCat = req.body.Edit_category;
  var passEdit = PasswordCategoryModel.findByIdAndUpdate(passId,{password_category : passEditCat})
  passEdit.exec((err,doc)=>{
    if(err) throw  err;
res.redirect('/passwordcategory')  });
});


router.get('/addnewpassword', checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  getPassCat.exec((err,data)=>{
    if(err) throw err;
    res.render('addNewPassword', { title: 'Password Management System', loginUser:loginUser, records:data, success:''  });
  })
});

router.post('/addnewpassword', checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var pass_cat = req.body.Pass_cat;
  var project_name = req.body.project_name;
  var pass_details = req.body.pass_details;
  var passdetails = new passwordDetailModel({
    password_category : pass_cat,
    project_name : project_name,
    password_details : pass_details

  })
  
  passdetails.save((err,data)=>{
    getPassCat.exec((err,data)=>{
      if(err) throw err;
      res.render('addNewPassword', { title: 'Password Management System', loginUser:loginUser, records:data, success:'Password detils inserted successfully'  });
    })
  });

});


router.get('/viewallpasswords', checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  getAllPass.exec((err,data)=>{
    if(err) throw err;
    res.render('viewAllPasswords', { title: 'Password Management System', loginUser:loginUser, records:data   });
  })
});

router.get('/password-detail', checkLoginUser, function(req, res, next) {
  res.redirect('dashboard')
});

router.get('/password-detail/edit/:id', checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var pass_detail_id = req.params.id;
  var get_pass_details = passwordDetailModel.findById({_id:pass_detail_id});
  get_pass_details.exec((err,data)=>{
    if(err) throw err;
    getPassCat.exec((err,data1)=>{
      if(err) throw err;
    res.render("editPasswordDetails", { title: 'Password Management System', loginUser:loginUser, records:data, record:data1, success:""  });

})
})
});

router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});
module.exports = router;
