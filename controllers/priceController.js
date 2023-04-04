const {Price} = require('../config/database');

exports.addPrice = async (req, res) => {
    try {
        const {price, userId} = req.body;
        if(!price || !userId) res.status(400).json({message: "Complete the information"});
        const newPrice = await Price.create({price, userId});
        res.status(200).json(newPrice);
    } catch (err) {
        res.status(400).json({message: err});
    }
};

exports.getPrices = async (req, res) => {
    try {
        const Prices = await Price.findAll();
        res.status(200).json(Prices);
    } catch (err) {
        res.status(400).json({message: err});
    }
};