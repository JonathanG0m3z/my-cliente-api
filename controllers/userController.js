require('dotenv').config();
const { JWT_SECRET } = process.env;
const { User } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { decryptValue, encryptValue } = require('../utils/cryptoHooks');

exports.createUser = async (req, res) => {
    try {
        const { name, password, phone, email, country } = req.body;
        if (!name || !password || !phone || !email || !country) throw Error("Error: information incomplete");
        const decryptedPassword = decryptValue(password);
        const hashedPassword = await bcrypt.hash(decryptedPassword, 12);
        const newUser = await User.create({ name, phone, email, password: hashedPassword, google_account: false, country });
        res.status(200).json({
            message: "Usuario creado correctamente",
        });
    } catch (err) {
        if (err.parent?.code === 'ER_DUP_ENTRY') res.status(400).json({ message: 'Este correo ya se encuentra registrado. Intenta con otro diferente.' });
        else res.status(400).json({ message: err.message });
    }
};

exports.validateUser = async (req, res) => {
    try {
        const { email, password, remember = false } = req.body;
        if (!email || !password) throw Error("Error: information incomplete");
        const userDB = await User.findOne({ where: { email: email } });
        if (userDB === null) throw Error("Este correo electrónico no se encuentra registrado");
        if(userDB.google_account) throw Error("Este correo electrónico fue registrado por medio de google");
        const decryptedPassword = decryptValue(password);
        const isPasswordMatch = await bcrypt.compare(decryptedPassword, userDB.password);
        if (isPasswordMatch) {
            const payload = { ...userDB.dataValues, password: null };
            const decryptedToken = jwt.sign(payload, JWT_SECRET, { expiresIn: remember ? '7d' : '1d' });
            const token = encryptValue(decryptedToken);
            res.status(200).json({ token });
        } else throw Error("Email o contraseña incorrectos");
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) throw Error("Error: information incomplete");
        const userDB = await User.findByPk(id);
        res.status(200).json({ ...userDB.dataValues, password: '' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.logOut = async (req, res) => {
    try {
        const encryptedToken = req.headers.authorization;
        if (!encryptedToken) throw Error("Error: information incomplete");
        const decryptedToken = decryptValue(encryptedToken);
        res.status(200).json({ message: 'Sesión cerrada exitosamente.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.googleAuth = async (req, res) => {
    try {
        const { name, email, picture, password } = req.body;
        if (!name || !password || !picture || !email) throw Error("Error: information incomplete");
        const decryptedPassword = decryptValue(password);
        const hashedPassword = await bcrypt.hash(decryptedPassword, 12);
        const userDB = await User.findOne({ where: { email: email } });
        if (userDB === null) {
            const newUser = await User.create({ name, phone: null, email, password: hashedPassword, google_account: true, picture });
            const payload = { ...newUser.dataValues, password: null };
            const decryptedToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
            const token = encryptValue(decryptedToken);
            res.status(200).json({ token });
        } else {
            if (userDB.google_account === false) throw Error('Error: Esta cuenta fue creada manualmente en la plataforma y no usando Google');
            const isPasswordMatch = await bcrypt.compare(decryptedPassword, userDB.password);
            if (isPasswordMatch) {
                const payload = { ...userDB.dataValues, password: null };
                const decryptedToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
                const token = encryptValue(decryptedToken);
                res.status(200).json({ token });
            } else {
                res.status(400).json({ message: "Hubo un error de comparación con la cuenta existente" });
            }
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};