const Joi = require('joi'); // validation package

module.exports = function(){
    Joi.objectId = require('joi-objectid')(Joi); //joi plugin for object id. THes also password complexity
};