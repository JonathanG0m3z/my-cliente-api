const { SharedBoard, Account, Service, User } = require('../config/database');
const { Op, fn, col } = require('sequelize');
const { decryptValue, encryptValue } = require('../utils/cryptoHooks');
const moment = require('moment');

exports.addSharedBoard = async (req, res) => {
    try {
        const { userId } = req;
        const { users, name } = req.body;
        const newBoard = await SharedBoard.create({
            users: users,
            name: name,
            userId,
        });
        return res.status(200).json({ message: "Tablero compartido creado correctamente" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getSharedBoards = async (req, res) => {
    try {
        const { userId, email } = req;
        const { page = 1, limit = 10 } = req.query; // Establecer valores predeterminados para la página y el límite
        const offset = (page - 1) * limit; // Calcular el desplazamiento basado en la página y el límite
        const boards = await SharedBoard.findAndCountAll({
            where: {
                [Op.or]: [
                    { userId: userId },
                    {
                        users: {
                            [Op.contains]: {
                                [`${email}`]: ['VER']
                            }
                        }
                    }
                ],
                deleted_at: { [Op.is]: null }
            },
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            total: boards.count,
            boards: boards.rows
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.addAccount = async (req, res) => {
    try {
        const { email, password, expiration, service, sharedBoardId, extras } = req.body;
        const sharedBoard = await SharedBoard.findOne({ where: { id: sharedBoardId } });
        if (!sharedBoard) throw new Error('No existe el tablero compartido');
        const newAccount = await Account.create({
            email: email,
            password: decryptValue(password),
            expiration: expiration,
            profiles: 0,
            serviceId: service?.value,
            userId: sharedBoard.userId,
            sharedBoardId,
            extras
        });
        return res.status(200).json({ ...newAccount.dataValues, password: password, service: { name: service?.label } });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAccounts = async (req, res) => {
    try {
        const { email, userId } = req;
        const { sharedBoardId } = req.params;
        const doIHaveAccess = await SharedBoard.findOne({
            where: {
                id: sharedBoardId,
                [Op.or]: [
                    { userId: userId },
                    {
                        users: {
                            [Op.contains]: {
                                [`${email}`]: ['VER']
                            }
                        }
                    }
                ],
            }
        });
        if (!doIHaveAccess) throw new Error('No tienes acceso a este tablero compartido');
        const { page = 1, limit = 10, search = '', is_deleted, end_date, begin_date, order } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = {
            sharedBoardId,
            [Op.or]: [
                { email: { [Op.iLike]: `%${search}%` } },
                { password: { [Op.iLike]: `%${search}%` } }
            ]
        };

        if (is_deleted === 'true') {
            whereClause.deleted_at = { [Op.not]: null };
        } else if (is_deleted === 'false') {
            whereClause.deleted_at = null;
        }

        if (end_date && begin_date) {
            whereClause.expiration = {
                [Op.between]: [begin_date, end_date]
            };
        } else if (end_date) {
            whereClause.expiration = {
                [Op.lte]: end_date
            };
        } else if (begin_date) {
            whereClause.expiration = {
                [Op.gte]: begin_date
            };
        }

        const accounts = await Account.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Service,
                    attributes: ['name']
                }
            ],
            order: [...(order === '' || order === undefined) ? [] : [order.split(' ')]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            total: accounts.count,
            accounts: accounts.rows.map(account => ({ ...account.dataValues, password: encryptValue(account.dataValues.password) })),
            permissions: userId === doIHaveAccess.userId ? 'admin' : doIHaveAccess.users?.[email]
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password, expiration, profiles, service, extras } = req.body;
        const account = await Account.update({
            email: email,
            password: decryptValue(password),
            expiration: expiration,
            profiles: profiles,
            serviceId: service?.value,
            extras,
        }, { where: { id } });
        res.status(200).json({ message: "Cuenta actualizada correctamente" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const account = await Account.update({ deleted_at: moment().format('YYYY-MM-DD HH:mm:ss') }, { where: { id } });
        res.status(200).json({ message: "Cuenta eliminada correctamente" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.reactivateAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const account = await Account.update({ deleted_at: null }, { where: { id } });
        res.status(200).json({ message: "Cuenta reactivada correctamente" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAccountsToRenewIptv = async (req, res) => {
    try {
        const { email, userId } = req;
        const { sharedBoardId } = req.params;
        const doIHaveAccess = await SharedBoard.findOne({
            where: {
                id: sharedBoardId,
                [Op.or]: [
                    { userId: userId },
                    {
                        users: {
                            [Op.contains]: {
                                [`${email}`]: ['VER']
                            }
                        }
                    }
                ],
            }
        });
        if (!doIHaveAccess) throw new Error('No tienes acceso a este tablero compartido');
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = {
            sharedBoardId,
            [Op.or]: [
                { email: { [Op.iLike]: `%${search}%` } },
                { password: { [Op.iLike]: `%${search}%` } }
            ]
        };
        whereClause.deleted_at = null;

        const accounts = await Account.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Service,
                    attributes: ['name'],
                    where: {
                        id: 'de24f168-4f18-4a1d-a437-192fa9477df5'
                    }
                }
            ],
            order: [['expiration', 'ASC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            total: accounts.count,
            accounts: accounts.rows.map(account => ({ ...account.dataValues, password: encryptValue(account.dataValues.password) })),
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};