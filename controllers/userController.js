require('dotenv').config();
const {JWT_SECRET, CRYPTOJS_SECRET_KEY} = process.env;
const {User} = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

exports.createUser = async (req, res) => {
    try {
        const {name, password, phone, email} = req.body;
        if(!name || !password || !phone || !email) throw Error("Error: information incomplete");
        const decryptedBytes = CryptoJS.AES.decrypt(password, CRYPTOJS_SECRET_KEY);
        const decryptedPassword = decryptedBytes.toString(CryptoJS.enc.Utf8);
        const hashedPassword = await bcrypt.hash(decryptedPassword, 10);
        const newUser = await User.create({name, phone, email, password: hashedPassword,});
        res.status(200).json({
            message: "Usuario creado correctamente",
        });
    } catch (err) {
        if (err.parent?.code === 'ER_DUP_ENTRY') res.status(400).json({message: 'Este correo ya se encuentra registrado. Intenta con otro diferente.'});
        else res.status(400).json({message: err.message});
    }
};

exports.validateUser = async (req, res) => {
    try {
        const {email, password, keepLoggedIn=false} = req.body;
        if(!email || !password) throw Error("Error: information incomplete");
        const userDB = await User.findOne({ where: { email: email } });
        if(userDB === null) throw Error("Este correo electrónico no se encuentra registrado");
        const decryptedBytes = CryptoJS.AES.decrypt(password, CRYPTOJS_SECRET_KEY);
        const decryptedPassword = decryptedBytes.toString(CryptoJS.enc.Utf8);
        const isPasswordMatch = await bcrypt.compare(decryptedPassword, userDB.password);
        if(isPasswordMatch) {
            const payload = {...userDB.dataValues, password: null};
            const decryptedToken = jwt.sign(payload, JWT_SECRET, {expiresIn: keepLoggedIn ? '1d' : '1m'});
            const token = CryptoJS.AES.encrypt(decryptedToken, CRYPTOJS_SECRET_KEY).toString();
            res.status(200).json({token});
        }else throw Error("Email o contraseña incorrectos");
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