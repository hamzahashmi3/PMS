const mongoose = require('mongoose');
// mongoose.connect("mongodb://localhost:27017/PMS",{useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
var conn = mongoose.Collection;
var userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:true,
        index:{
            unique:true
        }
    },
    email:{
        type: String,
        required:true,
        index:{
            unique:true
        }
    },
    password:{
        type: String,
        required:true,
    },
    date:{
        type: Date,
        default: Date.now
    }
});
var userModel = mongoose.model('user', userSchema);
module.exports= userModel;