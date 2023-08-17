const {Client} = require('../config/database');
const { decryptValue } = require('../utils/cryptoHooks');
const jwt = require('jsonwebtoken');

exports.addClient = async (req, res) => {
    try {
        const {userId} = req.query;
        const newClient = await Client.create({...req.body, userId});
        res.status(200).json(newClient);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.getClients = async (req, res) => {
    try {
        const {userId} = req;
        const clients = await Client.findAll({where: {userId}});
        res.status(200).json({clients});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.getClientById = async (req, res) => {
    try {
        const {userId} = req.query;
        const {id} = req.params;
        const isValid = await Client.findAll({where: {userId, id}});
        if(!isValid) throw Error("ClientId doesn't exist");
        const client = await Client.findByPk(id);
        res.status(200).json(client);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.updateClient = async (req, res) => {
    try {
        const {userId} = req.query;
        const {id} = req.params;
        const isValid = await Client.findAll({where: {userId, id}});
        if(!isValid) throw Error("ClientId doesn't exist");
        const client = await Client.update(req.body, {where: {userId, id}});
        res.status(200).json({message: `${client} fields updated successfully`});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const {userId} = req.query;
        const {id} = req.params;
        const isValid = await Client.findAll({where: {userId, id}});
        if(!isValid) throw Error("ClientId doesn't exist");
        const client = await Client.destroy({where: {userId, id}});
        res.status(200).json({message: "Client deleted successfully"});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.getClientsCombobox = async (req, res) => {
    try {
        const {userId} = req;
        const clients = await Client.findAll({where: {userId}});
        res.status(200).json({clients: clients.map((client)=>{
            return {id: client.id, phone: client.phone, name: client.name}
        })});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};