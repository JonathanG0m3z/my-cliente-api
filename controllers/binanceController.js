const CryptoJS = require('crypto-js');
const fetch = require('node-fetch');
const { Order, Account } = require('../config/database');
const { decryptValue } = require('../utils/cryptoHooks');
const moment = require('moment');
const { createIptvPremiunWithoutEndPoint } = require('./botsController');

const { BINANCE_API_KEY, BINANCE_NONCE, BINANCE_SECRET_KEY, URL_FRONT } = process.env;

function createSignature(body, secretKey, timestamp) {
    const nonce = BINANCE_NONCE; // Genera un nonce
    const bodyInString = JSON.stringify(body);
    const payload = `${timestamp}\n${nonce}\n${bodyInString}\n`; // Crea el payload

    // Crea la firma usando HMAC-SHA512
    const signature = CryptoJS.HmacSHA512(payload, secretKey)
        .toString(CryptoJS.enc.Hex)
        .toUpperCase(); // Convierte a mayúsculas

    return signature;
}

function verifyWebhookSignature(payload, signature, secretKey) {
    const payloadString = JSON.stringify(payload);
    const computedSignature = CryptoJS.HmacSHA512(payloadString, secretKey).toString(CryptoJS.enc.Hex).toUpperCase();
    return computedSignature === signature;
}


exports.buyIptvPremiun = async (req, res) => {
    try {
        const { userId } = req;
        const { username, password, demo, months } = req.body;
        const pass = decryptValue(password)
        const newAccount = await Account.create({
            email: username,
            status: "CREANDO",
            password: pass,
            expiration: demo ? moment().format('YYYY-MM-DD') : moment().add(months, 'months').format('YYYY-MM-DD'),
            profiles: 1,
            serviceId: 'de24f168-4f18-4a1d-a437-192fa9477df5',
            sharedBoardId: '2243e6ec-eb5b-456a-931a-9de58fda5af8',
            userId,
            createdInStore: true
        });

        const newOrder = await Order.create({
            userId,
            finished: false,
            accountId: newAccount.id,
            months: months
        });

        const timestamp = Date.now().toString();
        const body = {
            env: {
                terminalType: "APP"
            },
            merchantTradeNo: newOrder.merchantTradeNo,
            orderAmount: 0.00000001,
            currency: "USDT",
            goods: {
                goodsType: "02",
                goodsCategory: "1000",
                referenceGoodsId: "de24f168-4f18-4a1d-a437-192fa9477df5",
                goodsName: "IPTV Premiun"
            },
            returnUrl: `${URL_FRONT}/sharedBoards/2243e6ec-eb5b-456a-931a-9de58fda5af8`,
            webhookUrl: `${"https://6t347nc9-3001.use2.devtunnels.ms"}/binance/iptvPremiunWebhook`,
        };
        const signature = createSignature(body, BINANCE_SECRET_KEY, timestamp);

        const request = await fetch(`https://bpay.binanceapi.com/binancepay/openapi/v2/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'BinancePay-Timestamp': timestamp,
                'BinancePay-Nonce': BINANCE_NONCE, //string random de 32 caracteres
                'BinancePay-Certificate-SN': BINANCE_API_KEY, //apikey
                'BinancePay-Signature': signature
            },
            body: JSON.stringify(body)
        });

        const response = await request.json();
        if (request.ok) {
            const { data } = response
            await Order.update({
                prepayId: data?.prepayId,
                qrcodeLink: data?.qrcodeLink,
                checkoutUrl: data?.checkoutUrl
            }, { where: { merchantTradeNo: newOrder.merchantTradeNo } });
            return res.status(200).json({
                qrcodeLink: data?.qrcodeLink,
                checkoutUrl: data?.checkoutUrl
            });
        } else {
            await Account.destroy({
                where: {
                    id: newAccount.id
                }
            })
            return res.status(400).json(response);
        }
    } catch (err) {
        return res.status(400).json(err.message);
    }
};

exports.iptvPremiunWebhook = async (req, res) => {
    try {
        console.log(req)
        const payload = req.body;
        const signature = req.headers['binancepay-signature'];

        // Verifica la firma del webhook
        const isValidSignature = verifyWebhookSignature(payload, signature, BINANCE_SECRET_KEY);
        if (!isValidSignature) {
            console.log('Invalid signature');
            return res.status(400).send('Invalid signature');
        }

        console.log('Webhook received:', payload);

        // Mi código bajo suposicion
        if (payload.bizType === "PAY" && payload.bizStatus === "PAY_SUCCESS") {
            const orderData = JSON.parse(payload.data);
            const orderInDB = await Order.findOne({ where: { merchantTradeNo: orderData.merchantTradeNo } });
            if (orderInDB) {
                await Order.update({ finished: true }, { where: { merchantTradeNo: orderData.merchantTradeNo } });
                createIptvPremiunWithoutEndPoint(orderData);
            }
        }

        res.status(200).json({
            returnCode: "SUCCESS",
            returnMessage: null
        });
    } catch (err) {
        return res.status(400).json(err.message)
    }
}
