const express = require('express');

const home = require('../routes/home');
const courses = require('../routes/courses');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const logins = require('../routes/auth');

 // Middlewares
const helmet = require('helmet');
const error = require('../middleware/error');

module.exports = function(app){
    //HTML Rendering
    app.set('view engine','pug'); //Templating engine
    app.set('views','./views');

    //Built-In Middlewares
    app.use(express.json());
    app.use(express.urlencoded({extended : true}));
    app.use(express.static('public'));
    app.use(helmet());

    //Rendering routes
    app.use('/',home);
    app.use('/api/courses', courses);
    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use('/api/auth', logins);

    //Custom Middleware application
    app.use(error);
};