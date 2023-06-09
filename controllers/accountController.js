const {Account} = require('../config/database');
const regexFecha = /^\d{2}\/\d{2}\/\d{4}$/;

exports.addAccount = async (req, res) => {
    try {
        const {expiration} = req.body;
        const {userId} = req.query;
        if (!regexFecha.test(expiration)) throw Error("The expiration field must be a date");
        const newAccount = await Account.create({...req.body, userId});
        res.status(200).json(newAccount);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.getAccounts = async (req, res) => {
    try {
        const {userId} = req.query;
        const accounts = await Account.findAll({where: {userId}});
        res.status(200).json(accounts);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.getAccountById = async (req, res) => {
    try {
        const {userId} = req.query;
        const {id} = req.params;
        const isValid = await Account.findAll({where: {userId, id}});
        if(!isValid) throw Error("AccountId doesn't exist");
        const account = await Account.findByPk(id);
        res.status(200).json(account);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.updateAccount = async (req, res) => {
    try {
        const {userId} = req.query;
        const {id} = req.params;
        const isValid = await Account.findAll({where: {userId, id}});
        if(!isValid) throw Error("AccountId doesn't exist");
        const account = await Account.update(req.body, {where: {userId, id}});
        res.status(200).json({message: `${account} fields updated successfully`});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const {userId} = req.query;
        const {id} = req.params;
        const isValid = await Account.findAll({where: {userId, id}});
        if(!isValid) throw Error("AccountId doesn't exist");
        const account = await Account.destroy({where: {userId, id}});
        res.status(200).json({message: "Account deleted successfully"});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};