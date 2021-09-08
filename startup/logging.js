require('express-async-errors');
const winston = require('winston');
const path = require('path');
// require('winston-mongodb');

module.exports = function(){
    //Logging
    winston.exceptions.handle(
        new winston.transports.Console({colorize : true, prettyPrint : true}),
        new winston.transports.File({ filename : path.join(__dirname + '/logs/', 'uncaughtExceptions.log') })
    );
    winston.add(new winston.transports.Console({colorize : true, prettyPrint : true}) );
    winston.add(new winston.transports.File({ filename : path.join(__dirname + '/logs/', 'logfile.log') }) );
    // winston.add(new winston.transports.MongoDB({ 
    //     db : 'mongodb://localhost/vidly',
    //     level : 'error'
    // }));


    process.on('unhandledRejection', (ex) => {
        winston.error(ex.message, ex);
    });

};