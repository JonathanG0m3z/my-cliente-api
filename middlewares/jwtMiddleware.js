require('dotenv').config();
const {JWT_SECRET} = process.env;
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) return res.status(401).json({ message: 'No se proporcionó un token de autenticación' });
    try {
      const decodedToken = jwt.verify(token, JWT_SECRET);
      req.userId = decodedToken.userId;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token de autenticación no válido' });
    }
  };

module.exports = verifyToken;
