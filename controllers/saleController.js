const moment = require('moment');
const { Sale, Client, Account } = require('../config/database');
const { decryptValue } = require('../utils/cryptoHooks');

exports.addSale = async (req, res) => {
    try {
        const { userId } = req;
        const { expiration, account, client, pin, profile, price, phone, email, password, profiles, accountExpiration, service } = req.body;
        if (!expiration || !account || !client || pin === undefined || profile === undefined || price === undefined) throw Error("Complete the information");
        if (!client.id && !account.id) {
            const newClient = await Client.create({
                name: client.inputValue,
                phone,
                email,
                userId,
            });
            const newAccount = await Account.create({
                email: account.inputValue,
                password: decryptValue(password),
                expiration: moment(accountExpiration).format("YYYY-MM-DD"),
                profiles,
                serviceId: service.id,
                userId,
            });
            const newSale = await Sale.create({
                userId,
                price,
                profile,
                pin,
                expiration: moment(expiration).format("YYYY-MM-DD"),
                accountId: newAccount.id,
                clientId: newClient.id,
            });
            res.status(200).json({message: 'Venta registrada con éxito'});
        } else if (!client.id) {
            const newClient = await Client.create({
                name: client.inputValue,
                phone,
                email,
                userId,
            });
            const newSale = await Sale.create({
                userId,
                price,
                profile,
                pin,
                expiration: moment(expiration).format("YYYY-MM-DD"),
                accountId: account.id,
                clientId: newClient.id,
            });
            res.status(200).json({message: 'Venta registrada con éxito'});
        } else if (!account.id) {
            const newAccount = await Account.create({
                email: account.inputValue,
                password: decryptValue(password),
                expiration: moment(accountExpiration).format("YYYY-MM-DD"),
                profiles,
                serviceId: service.id,
                userId,
            });
            const newSale = await Sale.create({
                userId,
                price,
                profile,
                pin,
                expiration: moment(expiration).format("YYYY-MM-DD"),
                accountId: newAccount.id,
                clientId: client.id,
            });
            res.status(200).json({message: 'Venta registrada con éxito'});
        } else {
            const newSale = await Sale.create({
                userId,
                price,
                profile,
                pin,
                expiration: moment(expiration).format("YYYY-MM-DD"),
                accountId: account.id,
                clientId: client.id,
            });
            res.status(200).json({message: 'Venta registrada con éxito'});
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getSales = async (req, res) => {
    try {
        const { userId } = req;
        const sales = await Sale.findAll({
            where: { userId },
            include: [{
                model: Client,
                attributes: ['name', 'phone', 'email'],
            }, {
                model: Account,
                attributes: ['email', 'password'],
            }]
        });
        res.status(200).json(sales);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getSaleById = async (req, res) => {
    try {
        const { userId } = req.query;
        const { id } = req.params;
        const isValid = await Sale.findAll({
            where: { userId, id },
            include: [{
                model: Client,
                attributes: ['name', 'phone', 'email'],
            }, {
                model: Account,
                attributes: ['email', 'password'],
            }]
        });
        if (!isValid) throw Error("SaleId doesn't exist");
        const sale = await Sale.findByPk(id, {
            include: [{
                model: Client,
                attributes: ['name', 'phone', 'email'],
            }, {
                model: Account,
                attributes: ['email', 'password'],
            }]
        });
        res.status(200).json(sale);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateSale = async (req, res) => {
    try {
        const { userId } = req.query;
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
        const { userId } = req.query;
        const { id } = req.params;
        const isValid = await Sale.findAll({ where: { userId, id } });
        if (!isValid) throw Error("SaleId doesn't exist");
        const sale = await Sale.destroy({ where: { userId, id } });
        res.status(200).json({ message: "Sale deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};