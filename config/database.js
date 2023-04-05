const dbConfig = require('./dbConfig');
const { Sequelize } = require('sequelize');
const relations = require('./dbRelationship');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
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
db.Account = require('../models/accountModel.js')(sequelize, Sequelize);
db.Client = require('../models/clientModel.js')(sequelize, Sequelize);
db.Price = require('../models/priceModel.js')(sequelize, Sequelize);
db.Sale = require('../models/saleModel.js')(sequelize, Sequelize);
db.Service = require('../models/serviceModel.js')(sequelize, Sequelize);

/******Relations between models*******/
relations(sequelize.models);

db.sequelize.sync({ alter: true })
.then(() => {
    console.log("ReSync done!");
})
.catch(err =>{
    console.log("Error: "+err);
})

module.exports = db;