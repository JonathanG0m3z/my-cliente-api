const { Account } = require('../config/database');
const moment = require('moment');
const { decryptValue, encryptValue } = require('../utils/cryptoHooks');

const { URL_BOTS } = process.env;

exports.createIptvPremiunAccount = async (req, res) => {
    try {
        const { userId } = req;
        const { username, password, demo, months } = req.body;
        const pass = decryptValue(password)
        const newAccount = await Account.create({
            email: username,
            status: "CREANDO",
            password: pass,
            expiration: demo ? moment().format('YYYY-MM-DD') : moment().add(months, 'months').format('YYYY-MM-DD'),
            profiles: 1,
            serviceId: 'de24f168-4f18-4a1d-a437-192fa9477df5',
            sharedBoardId: '2243e6ec-eb5b-456a-931a-9de58fda5af8',
            userId,
            createdInStore: true
        });
        const request = await fetch(`${URL_BOTS}/iptvPremiun`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...req.body, password: pass })
        })
        const response = await request.json()
        if (request.ok) {
            await Account.update({
                status: "ACTIVA",
            }, { where: { id: newAccount.id } });
            return res.status(200).json(response);
        } else {
            await Account.update({
                status: "ERROR",
            }, { where: { id: newAccount.id } });
            throw new Error(response.message)
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.createLattvAccount = async (req, res) => {
    try {
        const { userId } = req;
        const { username, password, demo, months } = req.body;
        const pass = decryptValue(password)
        const newAccount = await Account.create({
            email: username,
            status: "CREANDO",
            password: pass,
            expiration: demo ? moment().format('YYYY-MM-DD') : moment().add(months, 'months').format('YYYY-MM-DD'),
            profiles: 1,
            serviceId: '4738f953-da82-4a15-aa52-c3cffd1e26d9',
            sharedBoardId: '2243e6ec-eb5b-456a-931a-9de58fda5af8',
            userId,
            createdInStore: true
        });
        const request = await fetch(`${URL_BOTS}/lattv`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...req.body, password: pass })
        })
        const response = await request.json()
        if (request.ok) {
            await Account.update({
                status: "ACTIVA",
            }, { where: { id: newAccount.id } });
            return res.status(200).json(response);
        } else {
            await Account.update({
                status: "ERROR",
            }, { where: { id: newAccount.id } });
            throw new Error(response.message)
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.createIptvPremiunWithoutEndPoint = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { username, password, months, userId } = data;
            const request = await fetch(`${URL_BOTS}/iptvPremiun`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    months,
                    userId
                })
            })
            const response = await request.json()
            if (request.ok) {
                await Account.update({
                    status: "ACTIVA",
                }, { where: { id: data?.account?.id } });
                return resolve();
            } else {
                await Account.update({
                    status: "ERROR",
                }, { where: { id: data?.account?.id } });
                throw new Error(response.message)
            }
        } catch (err) {
            reject();
        }
    })
};