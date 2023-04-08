const {Sale, Client, Account} = require('../config/database');
const regexFecha = /^\d{2}\/\d{2}\/\d{4}$/;

exports.addSale = async (req, res) => {
    try {
        const {expiration} = req.body;
        const {userId} = req.query;
        if (!regexFecha.test(expiration)) throw Error("The expiration field must be a date");
        const newSale = await Sale.create({...req.body, userId});
        res.status(200).json(newSale);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.getSales = async (req, res) => {
    try {
        const {userId} = req.query;
        const sales = await Sale.findAll({where: {userId},
            include: [{
                model: Client,
                attributes: ['name','phone','email'],
            },{
                model: Account,
                attributes: ['email','password'],
            }]});
        res.status(200).json(sales);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.getSaleById = async (req, res) => {
    try {
        const {userId} = req.query;
        const {id} = req.params;
        const isValid = await Sale.findAll({where: {userId, id},
            include: [{
                model: Client,
                attributes: ['name','phone','email'],
            },{
                model: Account,
                attributes: ['email','password'],
            }]});
        if(!isValid) throw Error("SaleId doesn't exist");
        const sale = await Sale.findByPk(id, {
            include: [{
                model: Client,
                attributes: ['name','phone','email'],
            },{
                model: Account,
                attributes: ['email','password'],
    }]});
        res.status(200).json(sale);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.updateSale = async (req, res) => {
    try {
        const {userId} = req.query;
        const {id} = req.params;
        const isValid = await Sale.findAll({where: {userId, id}});
        if(!isValid) throw Error("SaleId doesn't exist");
        const sale = await Sale.update(req.body, {where: {userId, id}});
        res.status(200).json({message: `${sale} fields updated successfully`});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.deleteSale = async (req, res) => {
    try {
        const {userId} = req.query;
        const {id} = req.params;
        const isValid = await Sale.findAll({where: {userId, id}});
        if(!isValid) throw Error("SaleId doesn't exist");
        const sale = await Sale.destroy({where: {userId, id}});
        res.status(200).json({message: "Sale deleted successfully"});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};