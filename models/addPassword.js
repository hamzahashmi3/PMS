const mongoose = require('mongoose');
var conn = mongoose.Collection;
var passwordDetailSchema = new mongoose.Schema({
    password_category:{
        type: String,
        required:true
    },
    project_name:{
        type: String,
        required:true
    },
    password_details:{
        type: String,
        required:true
    },
    date:{
        type: Date,
        default: Date.now
    }
});
var passwordDetailModel = mongoose.model('password-Details', passwordDetailSchema);
module.exports= passwordDetailModel;