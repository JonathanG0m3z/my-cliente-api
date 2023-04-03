const dbConfig = require('./dbConfig');
const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle,
        }
    }
);

sequelize.authenticate()
.then(() => {
    console.log("Connected...");
})
.catch(err => {
    console.log("Error "+err);
})

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('../models/userModel.js')(sequelize, Sequelize);
db.accounts = require('../models/accountModel.js')(sequelize, Sequelize);
db.clients = require('../models/clientModel.js')(sequelize, Sequelize);
db.prices = require('../models/priceModel.js')(sequelize, Sequelize);
db.sales = require('../models/saleModel.js')(sequelize, Sequelize);
db.services = require('../models/serviceModel.js')(sequelize, Sequelize);

db.sequelize.sync({ force: true })
.then(() => {
    console.log("ReSync done!");
})
.catch(err =>{
    console.log("Error: "+err);
})

module.exports = db;