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
    getPassCat.exec(function(err,data){
      if(err) throw  err;
      res.render('password_category', { title: 'Password Management System', loginUser:loginUser, records: data });
  });
  });
  
  router.get('/delete/:id', checkLoginUser, function(req, res, next) {
    var passId = req.params.id;
    var passdelete = PasswordCategoryModel.findByIdAndDelete(passId);
     passdelete.exec((err)=>{
      if(err) throw  err;
        res.redirect('/passwordcategory');
    });
  });
  
  router.get('/edit/:id', checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passId = req.params.id;
    var passEdit = PasswordCategoryModel.findById(passId)
    passEdit.exec((err,data)=>{
      if(err) throw  err;
      res.render('editPassCategory', { title: 'Password Management System', loginUser:loginUser, errors:'', success:'',id:passId , records: data });
    });
  });
  
  router.post('/edit', checkLoginUser, function(req, res, next) {
    var passId = req.body.edit_id;
    var passEditCat = req.body.Edit_category;
    var passEdit = PasswordCategoryModel.findByIdAndUpdate(passId,{password_category : passEditCat})
    passEdit.exec((err,doc)=>{
      if(err) throw  err;
  res.redirect('/passwordcategory')  });
  });
  

  module.exports = router;