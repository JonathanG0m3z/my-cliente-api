const {Client} = require('../config/database');
const { Op } = require('sequelize');

exports.addClient = async (req, res) => {
    try {
        const { userId } = req;
        const { name, phone, email, country } = req.body;
        if (!name || !phone) throw Error("Completa la información");
        const newClient = await Client.create({
                name,
                phone,
                email,
                country,
                userId,
            });
        res.status(200).json(newClient);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.getClients = async (req, res) => {
    try {
        const { userId } = req;
        const { page = 1, limit = 10 } = req.query; // Establecer valores predeterminados para la página y el límite
        const offset = (page - 1) * limit; // Calcular el desplazamiento basado en la página y el límite

        const clients = await Client.findAndCountAll({
            where: {
                userId,
                deleted_at: { [Op.is]: null }
            },
            order: [['name', 'ASC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
        res.status(200).json({
            total: clients.count,
            accounts: clients.rows
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
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
        const { id } = req.params;
        const { userId } = req;
        const { name, phone, email, country } = req.body;
        const client = await Client.update({
            email,
            name,
            phone,
            phone,
            country
        }, { where: { userId, id } });
        res.status(200).json({ message: "Cliente actualizado correctamente" });
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
        const { userId } = req;
        const { search = '', page = 1, limit = 5 } = req.query;
        const whereCondition = {
            userId,
        };
        if (search) {
            whereCondition[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { phone: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
            ];
        }
        const offset = (page - 1) * limit;
        const options = {
            where: whereCondition,
            offset: Number(offset),
            limit: Number(limit)
        };
        const clients = await Client.findAndCountAll(options);
        res.status(200).json({
            total: clients.count,
            totalPages: Math.ceil(clients.count / limit),
            currentPage: page,
            clients: clients.rows.map(client => ({
                id: client.id,
                phone: client.phone,
                name: client.name
            }))
        });
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};