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
                expiration: { [Op.gte]: currentDate },
                renewed: { [Op.not]: true }
            },
            include: [
                {
                    model: Client,
                    attributes: ['name', 'phone', 'email', 'id', 'country'],
                },
                {
                    model: Account,
                    attributes: ['email', 'password', 'id', 'expiration'],
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
        const { id } = req.params;
        const { expiration, account, client, pin, profile, price } = req.body;
        if (!expiration || !account || !client) throw Error("Completa la información");

        const saleToUpdate = await Sale.findByPk(id);

        if (!saleToUpdate) throw Error("No se encontró la venta");

        saleToUpdate.expiration = expiration;
        saleToUpdate.pin = pin;
        saleToUpdate.profile = profile;
        saleToUpdate.price = price ?? saleToUpdate.price;

        let updatedAccount = {};
        if (account?.email?.label) {
            updatedAccount = await Account.findByPk(account?.email?.value, {
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
                userId: saleToUpdate.userId,
            });
            updatedAccount = await Account.findByPk(temporalAccount.id, {
                include: [{
                    model: Service,
                    attributes: ['name']
                }]
            });
        }

        const updatedClient = client.search?.label
            ? await Client.findByPk(client.search?.value)
            : await Client.create({
                name: client.name,
                phone: client.phone,
                email: client.email,
                country: client.country,
                userId: saleToUpdate.userId,
            });

        saleToUpdate.accountId = updatedAccount.id;
        saleToUpdate.clientId = updatedClient.id;

        await saleToUpdate.save();

        res.status(200).json({
            message: 'Venta actualizada con éxito',
            sale: saleToUpdate,
            account: {
                ...updatedAccount.dataValues,
                password: encryptValue(updatedAccount.password)
            },
            client: updatedClient,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteSale = async (req, res) => {
    try {
        const { userId } = req;
        const { id } = req.params;
        const isValid = await Sale.findAll({ where: { userId, id } });
        if (!isValid) throw Error("No se encontró el ID de la venta");
        const sale = await Sale.destroy({ where: { userId, id } });
        res.status(200).json({ message: "Venta eliminada con exito" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.renewSale = async (req, res) => {
    try {
        const { id } = req.params;
        const { expiration, pin, profile, price } = req.body;

        // Buscar la venta existente
        const sale = await Sale.findByPk(id);
        if (!sale) throw new Error("La venta no fue encontrada");

        // Actualizar el campo renew en la venta existente
        await Sale.update({ renewed: true }, { where: { id: id } });

        // Crear una nueva venta basada en los datos de la venta existente
        const newSale = await Sale.create({
            userId: sale.userId,
            price: price ?? sale.price,
            profile: profile ?? sale.profile,
            pin: pin ?? sale.pin,
            expiration: expiration ?? sale.expiration,
            accountId: sale.accountId,
            clientId: sale.clientId,
        });

        res.status(200).json({
            message: 'Venta renovada exitosamente',
            renewedSale: newSale,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

