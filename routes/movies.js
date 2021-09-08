const auth = require('../middleware/auth');
const express = require('express');
const { Genre } = require('../models/genre');
const router = express.Router();
const { Movie, validate } = require('../models/movie');



router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title').exec();
    res.send(movies); 
});

router.get('/:id', async (req, res) => {
    const movie =  await Movie.findById(req.params.id).exec();  

    if(!movie) return res.status(400).send('The movie with the given ID does not exists...');

    res.send(movie);
});

router.post('/', auth, async (req, res) => {   
    const { error } = validate(req.body);

    if(error) return res.status(400).send(error.details[0].message);
    
    const genre = await Genre.findById(req.body.genreId).exec();
    if(!genre) return res.status(400).send('The genreId was invalid...');
    
    const movie = new Movie( {
        title : req.body.title,
        genre : {
            _id : genre._id,
            name : genre.name
        },
        numberInStock : req.body.numberInStock || 0,
        dailyRentalRate : req.body.dailyRentalRate || 0,
    });

    await movie.save();

    res.send(movie);
});


router.put('/:id', auth, async (req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId).exec();
    if(!genre) return res.status(400).send('The genreId was invalid...');
    
    const movie =  await Movie.findByIdAndUpdate(req.params.id, {
        title : req.body.title,
        genre : {
            _id : genre._id,
            name : genre.name
        },
        numberInStock : req.body.numberInStock || 0,
        dailyRentalRate : req.body.dailyRentalRate || 0
     }, { new : true });

    if(!movie) return res.status(400).send('The movie with the given ID does not exists...');
    
    res.send(movie);
});

router.delete('/:id', auth, async (req,res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    
    if(!movie) res.status(400).send('The movie with the given ID does not exists...');
    
    res.send(movie);
    
});





module.exports = router;