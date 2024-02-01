const { Op } = require('sequelize');
const {Service} = require('../config/database');

exports.addService = async (req, res) => {
    try {
        const {name, userId} = req.body;
        if(!name || !userId) throw Error("Complete the information");
        const newService = await Service.create({name});
        res.status(200).json(newService);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.getServicesCombo = async (req, res) => {
    try {
        const {userId} = req;
        const { search = '', page = 1, limit = 5 } = req.query;
        const whereCondition = {
            [Op.or]: [
                { userId: null },
                { userId: userId }
            ]
        };
        if (search) {
            whereCondition.name = {
                [Op.like]: `%${search}%`
            };
        }
        const offset = (page - 1) * limit;
        const options = {
            where: whereCondition,
            offset: Number(offset),
            limit: Number(limit)
        };
        const services = await Service.findAndCountAll(options);
        res.status(200).json({
            total: services.count,
            totalPages: Math.ceil(services.count / limit),
            currentPage: page,
            services: services.rows.map(service => ({
                id: service.id,
                name: service.name
            }))
        });
    } catch (err) {
        res.status(400).json({message: err});
    }
};

exports.updateService = async (req, res) => {
    try {
        const {id} = req.params;
        const {name} = req.body;
        if(!name || !id) throw Error("Complete the information");
        const isValid = await Service.findByPk(id);
        if(!isValid) throw Error("ServiceId doesn't exist");
        const service = await Service.update({name}, { where: { id }});
        res.status(200).json({message: `${service} fields updated successfully`});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.deleteService = async (req, res) => {
    try {
        const {id} = req.params;
        const isValid = await Service.findByPk(id);
        if(!isValid) throw Error("ServiceId doesn't exist");
        const service = await Service.destroy({ where: { id }});
        res.status(200).json({message: "Service deleted successfully"});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};