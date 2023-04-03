const dbConfig = require('@config/dbConfig.js');
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

db.users = require('./userModel.js')(sequelize, DataTypes);
db.accounts = require('./accountModel.js')(sequelize, DataTypes);
db.clients = require('./clientModel.js')(sequelize, DataTypes);
db.prices = require('./priceModel.js')(sequelize, DataTypes);
db.sales = require('./saleModel.js')(sequelize, DataTypes);
db.services = require('./serviceModel.js')(sequelize, DataTypes);

db.sequelize.sync({ force: true })
.then(() => {
    console.log("ReSync done!");
})
.catch(err =>{
    console.log("Error: "+err);
})

module.exports = db;