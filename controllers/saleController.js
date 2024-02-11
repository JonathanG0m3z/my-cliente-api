const moment = require('moment');
const { Sale, Client, Account, Service } = require('../config/database');
const { decryptValue, encryptValue } = require('../utils/cryptoHooks');
const { Op } = require('sequelize');

exports.addSale = async (req, res) => {
    try {
        const { userId } = req;
        const { expiration, account, client, pin, profile, price } = req.body;
        if (!expiration || !account || !client) throw Error("Completa la información");
        const newClient = client.search?.label
            ? await Client.findByPk(client.search?.value)
            : await Client.create({
                name: client.name,
                phone: client.phone,
                email: client.email,
                country: client.country,
                userId,
            });
        let newAccount = {};
        if (account?.email?.label) {
            newAccount = await Account.findByPk(account?.email?.value, {
                include: [{
                    model: Service,
                    attributes: ['name']
                }]
            });
        } else {
            const temporalAccount = await Account.create({
                email: account?.email?.value,
                password: decryptValue(account?.password),
                expiration: account?.expiration,
                profiles: account?.profiles,
                serviceId: account?.service?.value,
                userId,
            });
            newAccount = await Account.findByPk(temporalAccount.id, {
                include: [{
                    model: Service,
                    attributes: ['name']
                }]
            });
        }
        const newSale = await Sale.create({
            userId,
            price: price ?? 0,
            profile,
            pin,
            expiration,
            accountId: newAccount.id,
            clientId: newClient.id,
        });
        res.status(200).json({
            message: 'Venta registrada con éxito',
            sale: newSale, // Include the newSale details
            account: {
                ...newAccount.dataValues,
                password: encryptValue(newAccount.password)
            }, // Include the newAccount details
            client: newClient, // Include the newClient details
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getSales = async (req, res) => {
    try {
        const { userId } = req;
        const currentDate = moment().subtract(3, 'days').format('YYYY-MM-DD'); // Obtener la fecha actual
        const { page = 1, limit = 10 } = req.query; // Establecer valores predeterminados para la página y el límite
        const offset = (page - 1) * limit; // Calcular el desplazamiento basado en la página y el límite

        const sales = await Sale.findAndCountAll({
            where: {
                userId,
                expiration: { [Op.gte]: currentDate }
            },
            include: [
                {
                    model: Client,
                    attributes: ['name', 'phone', 'email'],
                },
                {
                    model: Account,
                    attributes: ['email', 'password'], // Excluir el campo de contraseña en la respuesta por defecto
                    include: [
                        {
                            model: Service,
                            attributes: ['name']
                        }
                    ]
                }
            ],
            order: [['expiration', 'ASC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        // Encriptar el campo de contraseña en cada cuenta de usuario
        sales.rows.forEach((sale) => {
            sale.account.password = encryptValue(sale.account.password);
        });

        res.status(200).json({
            total: sales.count,
            sales: sales.rows
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.getSaleById = async (req, res) => {
    try {
        const { userId } = req;
        const { id } = req.params;
        const sale = await Sale.findOne({
            where: { userId, id },
            include: [{
                model: Client,
                attributes: ['name', 'phone', 'email'],
            }, {
                model: Account,
                attributes: ['email', 'password'],
            }]
        });
        if (!sale) throw Error("No se encontró la venta");
        res.status(200).json(sale);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateSale = async (req, res) => {
    try {
        const { userId } = req;
        const { id } = req.params;
        const isValid = await Sale.findAll({ where: { userId, id } });
        if (!isValid) throw Error("SaleId doesn't exist");
        const sale = await Sale.update(req.body, { where: { userId, id } });
        res.status(200).json({ message: `${sale} fields updated successfully` });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteSale = async (req, res) => {
    try {
        const { userId } = req;
        const { id } = req.params;
        const isValid = await Sale.findAll({ where: { userId, id } });
        if (!isValid) throw Error("SaleId doesn't exist");
        const sale = await Sale.destroy({ where: { userId, id } });
        res.status(200).json({ message: "Sale deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};