var express = require('express');
var router = express.Router();
var bcrypt =require('bcrypt');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
var userModule = require('../models/user');
var PasswordCategoryModel = require('../models/passwordCategory');
var getPassCat = PasswordCategoryModel.find({});
var passwordDetailModel = require('../models/addPassword');
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
    getPassCat.exec((err,data)=>{
      if(err) throw err;
      res.render('addNewPassword', { title: 'Password Management System', loginUser:loginUser, records:data, success:''  });
    })
  });
  
  router.post('/', checkLoginUser, function(req, res, next) {
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

  module.exports = router;