const {Price} = require('../config/database');

exports.addPrice = async (req, res) => {
    try {
        const {price, serviceId} = req.body;
        const {userId} = req.query;
        if(!price || !userId || !serviceId) throw Error("Complete the information");
        const newPrice = await Price.create({price, userId, serviceId});
        res.status(200).json(newPrice);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.getPrices = async (req, res) => {
    try {
        const {userId} = req.query;
        const prices = await Price.findAll({where: {userId}});
        res.status(200).json(prices);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.getPriceById = async (req, res) => {
    try {
        const {id} = req.params;
        const {userId} = req.query;
        const isValid = await Price.findAll({where: {userId, id}});
        if(!isValid) throw Error("PriceId doesn't exist");
        const price = await Price.findByPk(id);
        res.status(200).json(price);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.updatePrice = async (req, res) => {
    try {
        const {id} = req.params;
        const {userId} = req.query;
        const isValid = await Price.findAll({where: {userId, id}});
        if(!isValid) throw Error("PriceId doesn't exist");
        const price = await Price.update(req.body, { where: { id }});
        res.status(200).json({message: `${price} fields updated successfully`});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.deletePrice = async (req, res) => {
    try {
        const {id} = req.params;
        const {userId} = req.query;
        const isValid = await Price.findAll({where: {userId, id}});
        if(!isValid) throw Error("PriceId doesn't exist");
        const price = await Price.destroy({ where: { id }});
        res.status(200).json({message: "Price deleted successfully"});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};