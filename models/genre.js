const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = mongoose.Schema({
    name : {
        type : String, 
        required : true,
        minlength : 5,
        maxlength : 50,
    }
});

const Genre = mongoose.model('Genre', genreSchema );

function validateGenre(request){
    //JOI implementation
    const schema = Joi.object({
        name : Joi.string().min(5).max(50).required()
    });

    const result = schema.validate(request);
    
    return result;
}

exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;