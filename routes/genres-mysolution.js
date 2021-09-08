const Joi = require('joi');
const express = require('express');
const router = express.Router();
const db = require('debug')('app:db'); // Namespace
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/project')
    .then(() => db('Connected to database'))
    .catch(err => db(err.message));

//Genres schema

const genreSchema = mongoose.Schema({
    name : {
        type : String, 
        required : true,
        minlength : 5,
        maxlength : 255,
        //match : /pattern/
    },
});

const Genre = mongoose.model('Genre',genreSchema);


router.get('/', (req, res) => {
    const genres = getGenres()
        .then( (result) => { res.send(result); } );
    

});

router.get('/:id', (req, res) => {
    getGenreById(req.params.id)
        .then( (result) => { res.send(result); } )
        .catch( err => res.status(400).send(err.message));
});

router.post('/', (req, res) => {   
    const { error } = validateGenre(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    const data = {
        name : req.body.name
    };

    const genre = createGenres(data)
        .then( (result) => { res.send(result); } )
        .catch( err => res.status(400).send(err.message));
});


router.put('/:id', (req,res) => {
    // let genre = getGenreById(req.params.id)
    //     .then( result => { console.log(result)})
    // if(!genre) return res.status(404).send('The genre with the given ID was not valid!'); //404

    const { error } = validateGenre(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    const data = {
        name : req.body.name
    };

    const genre = updateGenres(req.params.id,data)
        .then( result => { res.send(result); })
        .catch( err => { res.status(400).send(err.message); });

    
});

router.delete('/:id', (req,res) => {
    deleteGenres(req.params.id)
        .then( (result) => { res.send(result); } )
        .catch( err => res.status(400).send(err.message));
});

function validateGenre(request){
    //JOI implementation
    const schema = Joi.object({
        name : Joi.string().min(3).required()
    });

    const result = schema.validate(request);
    
    return result;
}

async function getGenres(){
    try{
        return await Genre.find().exec();
    } catch (error){
        return error;
    }
    
}

async function createGenres(data){
    const genre = new Genre(data);

    try {
        return await genre.save();
    } catch (error) {
        return error;
    }
}
async function getGenreById(id){
    try{
        return await Genre.findById(id).exec();
    } catch (error){
        return error;
    }
    
}

async function updateGenres(id,data){
    try{
        return await Genre.findByIdAndUpdate(id,data,{ new : true });
    } catch (error){
        return error;
    }
}

async function deleteGenres(id){
    try{
        return await Genre.findByIdAndDelete(id);
    } catch (error){
        return error;
    }
}


module.exports = router;