const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const movieSchema = mongoose.Schema({
    title : {
        type: String,
        required : true,
        trim: true,
        minLength: 5,
        maxLength: 255
    },
    numberInStock : {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate : {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    genre : {
        type : genreSchema,
        required : true
    } 
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(request){
    const movieSchema = Joi.object({
        title : Joi.string().min(5).max(255).required(),
        numberInStock : Joi.number().min(0).required(),
        dailyRentalRate : Joi.number().min(0).required(),
        genreId : Joi.objectId().required()
    });

    return movieSchema.validate(request);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
module.exports.movieSchema = movieSchema;