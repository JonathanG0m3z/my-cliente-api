require('dotenv').config();
const {JWT_SECRET} = process.env;
const {User} = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    try {
        const {name, user, password, phone, email} = req.body;
        if(!name || !user || !password || !phone || !email) throw Error("Error: information incomplete");
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await User.create({name, user, phone, email, password: hashedPassword,});
        res.status(200).json(newUser);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.validateUser = async (req, res) => {
    try {
        const {user, password} = req.body;
        if(!user || !password) throw Error("Error: information incomplete");
        const userDB = await User.findOne({ where: { user: user } });
        if(userDB === null) throw Error("User not found");
        const isPasswordMatch = await bcrypt.compare(password, userDB.password);
        if(isPasswordMatch) {
            const payload = {userId: userDB.id};
            const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'});
            res.status(200).json({...payload, token});
        }else throw Error("Password wrong");
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.getUser = async (req, res) => {
    try {
        const {id} = req.params;
        if(!id) throw Error("Error: information incomplete");
        const userDB = await User.findByPk(id);
        res.status(200).json({...userDB.dataValues, password: ''});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};