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
    res.redirect('dashboard')
  });
  
  router.get('/edit/:id', checkLoginUser, function(req, res, next) {
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
  
  router.post('/edit/:id', checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var pass_detail_id = req.params.id;
    var pass_cat = req.body.pass_cat;
    var project_name = req.body.project_name;
    var pass_details = req.body.pass_details;
    passwordDetailModel.findByIdAndUpdate(pass_detail_id,
      {password_category : pass_cat,
        project_name: project_name,
        password_details: pass_details}).exec(function(err){
          if(err) throw err;
          var get_pass_details = passwordDetailModel.findById({_id:pass_detail_id});
          get_pass_details.exec((err,data)=>{
            if(err) throw err;
            getPassCat.exec((err,data1)=>{
              if(err) throw err;
            res.render("editPasswordDetails", { title: 'Password Management System', loginUser:loginUser, records:data, record:data1, success:"Password Updated successfully"  });
        });
        });
        });
        });
  

  module.exports = router;