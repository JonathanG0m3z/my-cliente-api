const {Price} = require('../config/database');

exports.addPrice = async (req, res) => {
    try {
        const {price, userId} = req.body;
        if(!price || !userId) throw Error("Complete the information");
        const newPrice = await Price.create({price, userId});
        res.status(200).json(newPrice);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.getPrices = async (req, res) => {
    try {
        const prices = await Price.findAll();
        res.status(200).json(prices);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.getPriceById = async (req, res) => {
    try {
        const {id} = req.params;
        const price = await Price.findByPk(id);
        res.status(200).json(price);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};