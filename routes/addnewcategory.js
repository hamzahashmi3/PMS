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
mongoose.connect("mongodb://localhost:27017/pms",{useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});



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


  router.get('/', checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser'); 
    // console.log(errors)
      res.render('addNewCategory', { title: 'Password Management System', loginUser:loginUser, errors:'', success:""});
  });
  
  router.post('/', checkLoginUser, [
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
  

  module.exports = router;