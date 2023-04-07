const {Service} = require('../config/database');

exports.addService = async (req, res) => {
    try {
        const {name} = req.body;
        if(!name) throw Error("Complete the information");
        const newService = await Service.create({name});
        res.status(200).json(newService);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.getServices = async (req, res) => {
    try {
        const services = await Service.findAll();
        res.status(200).json(services);
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