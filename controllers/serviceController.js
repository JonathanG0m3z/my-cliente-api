const { Op } = require('sequelize');
const {Service} = require('../config/database');

exports.addService = async (req, res) => {
    try {
        const {userId} = req;
        const {name} = req.body;
        if(!name || !userId) throw Error("Complete la información por favor");
        if(name === 'Activación youtube') throw Error("Este nombre se encuentra protegido, usa otro");
        const newService = await Service.create({name, userId});
        res.status(200).json(newService);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.getServices = async (req, res) => {
    try {
        const { userId } = req;
        const { page = 1, limit = 10 } = req.query; // Establecer valores predeterminados para la página y el límite
        const offset = (page - 1) * limit; // Calcular el desplazamiento basado en la página y el límite

        const services = await Service.findAndCountAll({
            where: {
                [Op.or]: [
                    { userId: null },
                    { userId: userId }
                ]
            },
            order: [['name', 'ASC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
        res.status(200).json({
            total: services.count,
            services: services.rows
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
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
                [Op.iLike]: `%${search}%`
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
        const {userId} = req;
        const {id} = req.params;
        const {name} = req.body;
        if(!name || !id) throw Error("Complete la información por favor");
        if(name === 'Activación youtube') throw Error("Este nombre se encuentra protegido, usa otro");
        const isValid = await Service.findByPk(id);
        if(!isValid) throw Error("El servicio no existe");
        const service = await Service.update({name}, { where: { id, userId }});
        res.status(200).json({message: 'Servicio actualizado con exito'});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.deleteService = async (req, res) => {
    try {
        const {userId} = req;
        const {id} = req.params;
        const isValid = await Service.findByPk(id);
        if(!isValid) throw Error("El servicio no existe");
        const service = await Service.destroy({ where: { id, userId } });
        res.status(200).json({message: "Servicio eliminado correctamente"});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};