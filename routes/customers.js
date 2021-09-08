const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { Customer, validate} = require('../models/customer');


router.get('/', async (req,res) => {
    const genres = await Customer.find().sort('name').exec();
    res.send(genres);
});

router.post('/', auth, async (req,res) => {
    const { error } = validate(req.body);
    if(error) res.status(400).send(error.details[0].message);

    const customer = new Customer({
        name : req.body.name,
        phone : req.body.phone,
        isGold: req.body.isGold
    });

    await customer.save();

    res.send(customer);
});

router.put('/:id', auth, async (req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id,{
        name : req.body.name,
        phone : req.body.phone,
        isGold: req.body.isGold
    }, { new : true });

    if(!customer) return res.status(400).send("The given ID was invalid...");

    res.send(customer);
});

router.delete('/:id', auth, async (req,res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if(!customer) return res.status(400).send("The given ID was invalid...");

    res.send(customer);
});

router.get('/:id', async (req,res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(400).send("The given ID was invalid...");

    res.send(customer);
});


module.exports = router;