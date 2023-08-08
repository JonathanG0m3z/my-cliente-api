require('dotenv').config();
const {JWT_SECRET} = process.env;
const {User} = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    try {
        const {name, password, phone, email} = req.body;
        if(!name || !password || !phone || !email) throw Error("Error: information incomplete");
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await User.create({name, phone, email, password: hashedPassword,});
        res.status(200).json({
            user: newUser.user,
        });
    } catch (err) {
        if (err.parent?.code === 'ER_DUP_ENTRY') res.status(400).json({message: 'Este correo ya se encuentra registrado. Intenta con otro diferente.'});
        else res.status(400).json({message: err.message});
    }
};

exports.validateUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) throw Error("Error: information incomplete");
        const userDB = await User.findOne({ where: { email: email } });
        if(userDB === null) throw Error("User not found");
        const isPasswordMatch = await bcrypt.compare(password, userDB.password);
        if(isPasswordMatch) {
            const payload = {...userDB.dataValues, password: ""};
            const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '15d'});
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