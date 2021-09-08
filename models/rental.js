const Joi = require('joi');
const mongoose = require('mongoose');


//Used new schema to scope properties
const renterSchema = new mongoose.Schema({
    name : {
        type: String,
        required : true,
        minLength: 5,
        maxLength: 50
    },
    phone : {
        type: String,
        required: true,
        length: 11
    },
    isGold: {
        type: Boolean,
        default: false
    }
});

//Used new schema to scope properties
const movieSchema = new mongoose.Schema({
    title : {
        type: String,
        required : true,
        trim: true,
        minLength: 5,
        maxLength: 255
    },
    dailyRentalRate : {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
});

const Rental = mongoose.model('Rental',mongoose.Schema({
    customer : {
        type : renterSchema,
        required : true
    },
    movie : {
        type : movieSchema,
        required : true
    },
    dateOut : {
        type: Date,
        required : true,
        default: Date.now
    },
    dateReturned : {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
}) );

function validateRent(request){
    const schema = Joi.object({
        customerId : Joi.objectId().required(),
        movieId : Joi.objectId().required()
    });

    return schema.validate(request);
}

module.exports.Rental = Rental;
module.exports.validate = validateRent;