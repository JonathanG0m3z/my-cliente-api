require('dotenv').config();
const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { decryptValue } = require('../utils/cryptoHooks');

const invalidTokens = [];

const verifyToken = (req, res, next) => {
  const encryptedToken = req.headers.authorization;
  if (!encryptedToken) return res.status(401).json({ message: 'No se proporcionó un token de autenticación' });

  const token = decryptValue(encryptedToken);

  if (invalidTokens.find((item) => token === item)) return res.status(401).json({ message: 'El token dejó de ser valido. Vuelve a iniciar sesión' });

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds

    if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
      return res.status(401).json({ message: 'Token de autenticación expirado' });
    }

    // Verificar la firma del token
    const isSignatureValid = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    if (!isSignatureValid) {
      return res.status(401).json({ message: 'Firma del token no válida' });
    }

    req.userId = decodedToken.id;
    req.email = decodedToken.email;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token de autenticación no válido' });
  }
};

const invalidateToken = (token) => {
  invalidTokens.push(token);
};


module.exports = {
  verifyToken,
  invalidateToken
};
