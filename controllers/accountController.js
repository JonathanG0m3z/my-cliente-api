const { Account, Service } = require('../config/database');
const { Op } = require('sequelize');
const moment = require('moment');
const { decryptValue, encryptValue } = require('../utils/cryptoHooks');

const regexFecha = /^\d{2}\/\d{2}\/\d{4}$/;

exports.addAccount = async (req, res) => {
    try {
        const { expiration } = req.body;
        const { userId } = req.query;
        if (!regexFecha.test(expiration)) throw Error("The expiration field must be a date");
        const newAccount = await Account.create({ ...req.body, userId });
        res.status(200).json(newAccount);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAccounts = async (req, res) => {
    try {
        const { userId } = req;
        const currentDate = moment().subtract(5, 'days').format('YYYY-MM-DD'); // Obtener la fecha actual
        const { page = 1, limit = 10 } = req.query; // Establecer valores predeterminados para la página y el límite
        const offset = (page - 1) * limit; // Calcular el desplazamiento basado en la página y el límite

        const accounts = await Account.findAndCountAll({
            where: {
                userId,
                expiration: { [Op.gte]: currentDate },
                deleted_at: { [Op.is]: null }
            },
            include: [
                {
                    model: Service,
                    attributes: ['name']
                }
            ],
            order: [['expiration', 'ASC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        accounts.rows.forEach((accounts) => {
            accounts.password = encryptValue(accounts.password);
        });

        res.status(200).json({
            total: accounts.count,
            accounts: accounts.rows
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAccountById = async (req, res) => {
    try {
        const { userId } = req.query;
        const { id } = req.params;
        const isValid = await Account.findAll({ where: { userId, id } });
        if (!isValid) throw Error("AccountId doesn't exist");
        const account = await Account.findByPk(id);
        res.status(200).json(account);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateAccount = async (req, res) => {
    try {
        const { userId } = req.query;
        const { id } = req.params;
        const isValid = await Account.findAll({ where: { userId, id } });
        if (!isValid) throw Error("AccountId doesn't exist");
        const account = await Account.update(req.body, { where: { userId, id } });
        res.status(200).json({ message: `${account} fields updated successfully` });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const { userId } = req.query;
        const { id } = req.params;
        const isValid = await Account.findAll({ where: { userId, id } });
        if (!isValid) throw Error("AccountId doesn't exist");
        const account = await Account.destroy({ where: { userId, id } });
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAccountsCombo = async (req, res) => {
    try {
        const { userId } = req;
        const { search = '', page = 1, limit = 5 } = req.query;
        const whereCondition = {
            userId,
            expiration: {
                [Op.gte]: moment().subtract(3, 'days')
            },
            deleted_at: { [Op.is]: null }
        };
        if (search) {
            whereCondition.email = {
                [Op.like]: `%${search}%`
            };
        }
        const offset = (page - 1) * limit;
        const options = {
            where: whereCondition,
            offset: Number(offset),
            limit: Number(limit)
        };
        const accounts = await Account.findAndCountAll(options);
        res.status(200).json({
            total: accounts.count,
            totalPages: Math.ceil(accounts.count / limit),
            currentPage: page,
            accounts: accounts.rows.map(account => ({
                id: account.id,
                email: account.email
            }))
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};