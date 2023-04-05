const {User} = require('../config/database');
const bcrypt = require('bcrypt');

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
        if(isPasswordMatch) res.status(200).json({message: "Login successfully"});
        else throw Error("Password wrong");
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};