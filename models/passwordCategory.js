const mongoose = require('mongoose');
var conn = mongoose.Collection;
var passwordCategorySchema = new mongoose.Schema({
    password_category:{
        type: String,
        required:true,
        index:{
            unique:true
        }
    },
    date:{
        type: Date,
        default: Date.now
    }
});
var PasswordCategoryModel = mongoose.model('password-Category', passwordCategorySchema);
module.exports= PasswordCategoryModel;