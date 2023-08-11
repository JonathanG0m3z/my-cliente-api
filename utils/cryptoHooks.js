const CryptoJS = require('crypto-js');
const { CRYPTOJS_SECRET_KEY } = process.env;

exports.encryptValue = (value) => {
    return CryptoJS.AES.encrypt(value, CRYPTOJS_SECRET_KEY).toString();
};

exports.decryptValue = (value) => {
    const decryptedBytes = CryptoJS.AES.decrypt(value, CRYPTOJS_SECRET_KEY);
    return decryptedBytes.toString(CryptoJS.enc.Utf8);
};