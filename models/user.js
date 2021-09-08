const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minLength : 5,
        maxLength: 50
    },
    email : {
        type: String,
        required: true,
        unique: true,
        minlength : 5,
        maxlength: 255
    },
    password : {
        type: String,
        required: true,
        minLength : 4,
        maxlength: 1024
    },
    isAdmin :{
        type: Boolean,
        default: false
    }
}) ;

userSchema.methods.generateAuthToken = function(){
    return jwt.sign( { 
        _id : this._id, isAdmin: this.isAdmin
    },
    config.get('jwtPrivateKey'));
};

const User = mongoose.model('User',userSchema);


function validateUser(request){
    const schema = Joi.object({
        name : Joi.string().min(5).max(50).required(),
        email : Joi.string().min(5).max(255).email().required(),
        password : Joi.string().min(4).max(255).required()
    });

    return schema.validate(request);
}

exports.User = User;
exports.validate = validateUser;
