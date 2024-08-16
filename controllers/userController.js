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
            if (userDB.google_account === false) throw Error('Esta cuenta fue creada manualmente en la plataforma y no usando Google');
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

exports.getBalanceById = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId) throw Error("Information incompleta");
        const userDB = await User.findByPk(userId);
        res.status(200).json({ balance: userDB.balance ?? 0 });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.resetBalance = async (req, res) => {
    try {
        const { userId } = req;
        if(userId !== 'd7887bff-24d2-4e26-b3aa-c2bd18323003') throw Error("No tienes permisos para realizar esta operación");
        await User.update({
            balance: 0
        }, { where: { id: '642b717f-3557-4eaa-8402-420b054f0a94' } });
        res.status(200).json({ message: "Saldo reiniciado con exito" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAdminBalance = async (req, res) => {
    try {
        const { userId } = req;
        const { id } = req.params;
        if (!userId || !id) throw Error("Informacion incompleta");
        if(userId !== 'd7887bff-24d2-4e26-b3aa-c2bd18323003') throw Error("No tienes permisos para realizar esta operación");
        const userDB = await User.findByPk(id);
        res.status(200).json({ balance: userDB.balance ?? 0 });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};