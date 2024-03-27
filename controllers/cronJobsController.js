const moment = require('moment');
const { Sale, Client, Account, Service } = require('../config/database');
const { Op } = require('sequelize');
const transporter = require('../config/mailer');
const { youtubeTemplate } = require('../mails/youtubeActivation/YoutubeTemplate.js');

exports.sendEmailReminder = async () => {
    try {
        const fiveDaysDate = moment().add(5, 'days').format('YYYY-MM-DD');
        const threeDaysDate = moment().add(3, 'days').format('YYYY-MM-DD')
        const currentDate = moment().format('YYYY-MM-DD');

        const defaultFields = {
            include: [
                {
                    model: Client,
                    attributes: ['email'],
                },
                {
                    model: Account,
                    attributes: ['email'],
                    include: [
                        {
                            model: Service,
                            attributes: ['name']
                        }
                    ]
                }
            ],
            attributes: ['expiration']
        }

        const defaultWhere = { renewed: { [Op.not]: true } }

        const salesToRenew = await Sale.findAll({
            where: {
                [Op.or]: [
                    { expiration: fiveDaysDate },
                    { expiration: threeDaysDate },
                    { expiration: currentDate },
                ],
                '$account.service.name$': 'Activación youtube',
                ...defaultWhere
            },
            ...defaultFields
        });
        for (const sale of salesToRenew) {
            const daysToRenew = moment(sale.expiration).diff(moment().format('YYYY-MM-DD'), 'days');
            await transporter.sendMail({
                from: '"Recordatorio MyCliente" <contacto.mycliente@gmail.com>', // sender address
                to: sale.client.email, // correo del cliente
                subject: "Renovación de suscripción", // Asunto
                html: youtubeTemplate(daysToRenew), // Cuerpo del correo HTML
            });
        }
        return
    } catch (err) {
        throw new Error(err);
    }
}