const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer',mongoose.Schema({
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
}) );

function validateCustomer(request){
    const customerSchema = Joi.object({
        name : Joi.string().min(5).max(50).required(),
        phone : Joi.string().length(11).required(),
        isGold : Joi.boolean().required()
    });

    return customerSchema.validate(request);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;