const { Account, Service, Sale } = require('../config/database');
const { Op, where } = require('sequelize');
const moment = require('moment');
const { decryptValue, encryptValue } = require('../utils/cryptoHooks');

exports.addAccount = async (req, res) => {
    try {
        const { userId } = req;
        const { email, password, expiration, profiles, service } = req.body;
        const newAccount = await Account.create({
            email: email,
            password: decryptValue(password),
            expiration: expiration,
            profiles: profiles,
            serviceId: service?.value,
            userId,
        });
        return { ...newAccount, password: password, service: { name: service?.label } };
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
        const accountsList = []
        // Iterar sobre cada cuenta para agregar el campo profilesAvailable
        for (const account of accounts.rows) {
            const salesCount = await Sale.count({
                where: {
                    accountId: account.dataValues.id,
                    renewed: { [Op.not]: true },
                    expiration: { [Op.gte]: moment().format('YYYY-MM-DD') }
                }
            });
            accountsList.push({
                ...account.dataValues,
                profilesAvailable: account.dataValues.profiles - salesCount,
                password: encryptValue(account.password)
            });
        }
        res.status(200).json({
            total: accounts.count,
            accounts: accountsList
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
        const { id } = req.params;
        const { userId } = req;
        const { email, password, expiration, profiles, service } = req.body;
        const account = await Account.update({
            email: email,
            password: decryptValue(password),
            expiration: expiration,
            profiles: profiles,
            serviceId: service?.value,
            userId,
        }, { where: { userId, id } });
        res.status(200).json({ message: "Cuenta actualizada correctamente" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const { userId } = req;
        const { id } = req.params;
        const account = await Account.update({ deleted_at: moment().format('YYYY-MM-DD HH:mm:ss') }, { where: { userId, id } });
        res.status(200).json({ message: "Cuenta eliminada correctamente" });
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

exports.renewAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, expiration } = req.body;
        const account = await Account.findByPk(id);
        if (!account) throw new Error("La cuenta no fue encontrada");
        await Account.update({
            password: decryptValue(password),
            expiration: expiration
        }, { where: { id: id } });
        res.status(200).json({
            message: 'Cuenta renovada exitosamente'
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};