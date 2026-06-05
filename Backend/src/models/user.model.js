const { required } = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : [true , 'Username already taken'],
    } , 
    email : {
        type : String,
        required : true,
        unique : [true , 'Email already registered with another user account'],
    },
    password : {
        type : String,
        required : true,
        minlength : [6 ,"Password must be at least 6 characters long"],
    }
})

const Usermodel = mongoose.model('User',userSchema);
module.exports = Usermodel;