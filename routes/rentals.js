const auth = require('../middleware/auth');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const { Rental, validate } = require('../models/rental');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init('mongodb://localhost/vidly');

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut').exec();
    res.send(rentals); 
});


router.post('/', auth, async (req, res) => {   
    const { error } = validate(req.body);

    if(error) return res.status(400).send(error.details[0].message);
    
    const customer = await Customer.findById(req.body.customerId).exec();
    
    if(!customer) return res.status(400).send('The invalid customer.');

    const movie = await Movie.findById(req.body.movieId).exec();
    
    if(!movie) return res.status(400).send('The invalid movie.');
    
    if(movie.numberInStock === 0) return res.status(400).send('Movie not available.');
    
    let rental = new Rental( {
        customer : {
            _id : customer._id,
            name : customer.name,
            phone : customer.phone,
            isGold : customer.isGold
        },
        movie : {
            _id : movie._id,
            title : movie.title,
            dailyRentalRate : movie.dailyRentalRate,
        }
    });
    try{

        new Fawn.Task()
        .save('rentals',rental)
        .update('movies',{_id:movie._id},{
            $inc : {
                numberInStock: -1
            }
        }).run();

        res.send(rental);
    } catch (ex){
        res.status(500).send('Something went wrong.');
    }

    // rental = await rental.save();

    // // movie.dailyRentalRate++;
    // movie.numberInStock--;
    // movie.save();

    // res.send(rental);
});


router.put('/:id', auth, async (req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId).exec();
    if(!genre) return res.status(400).send('The genreId was invalid...');
    
    const movie =  await Movie.findByIdAndUpdate(req.params.id, {
        title : req.body.title,
        genre : {
            id : genre._id,
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


router.get('/:id', async (req, res) => {
    const movie =  await Movie.findById(req.params.id).exec();  

    if(!movie) return res.status(400).send('The movie with the given ID does not exists...');

    res.send(movie);
});



module.exports = router;