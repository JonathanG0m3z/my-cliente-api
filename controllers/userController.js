const {User} = require('../config/database');

exports.addUser = async (req, res) => {
    try {
        const {name, user, password, phone, email} = req.body;
        if(!name || !user || !password || !phone || !email) res.status(400).json({message: "Complete the information"});
        const newUser = await User.create({name, user, password, phone, email});
        res.status(200).json(newUser);
    } catch (err) {
        res.status(400).json({message: "Hola"});
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({message: "Hola"});
    }
};