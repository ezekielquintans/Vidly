// const debug = require('debug')('app:startup'); // Namespace
const morgan = require('morgan'); // Middleware
const config = require('config'); //Config Management

module.exports = function(app){
    //Configuration
    // debug(`Application Name: ${config.get('name')}`);
    // debug(`Application Mail: ${config.get('mail.host')}`);
    // debug(`Mail Password: ${config.get('mail.password')}`);

    if(!config.get('jwtPrivateKey')){
        console.error('FATAL ERROR: jwtPrivateKey is not defined.');
        process.exit(1);
    }

    //Environment checking
    if(app.get('env') === "development"){
        app.use(morgan('tiny'));
        // debug('Morgan enabled...');    
    }
};