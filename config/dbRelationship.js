const relations = ({user, account, client, price, sale, service}) => {
    /*PRICE RELATIONS*/
    service.hasMany(price, { foreignKey: 'serviceId' });
    price.belongsTo(service, { foreignKey: 'serviceId' });
    user.hasMany(price, { foreignKey: 'userId' });
    price.belongsTo(user, { foreignKey: 'userId' });
    /*ACCOUNT RELATIONS*/
    service.hasMany(account, { foreignKey: 'serviceId' });
    account.belongsTo(service, { foreignKey: 'serviceId' });
    user.hasMany(account, { foreignKey: 'userId' });
    account.belongsTo(user, { foreignKey: 'userId' });
    /*SALE RELATIONS*/
    account.hasMany(sale, { foreignKey: 'accountId' });
    sale.belongsTo(account, { foreignKey: 'accountId' });
    user.hasMany(sale, { foreignKey: 'userId' });
    sale.belongsTo(user, { foreignKey: 'userId' });
    /*CLIENT RELATIONS*/
    user.hasMany(client, { foreignKey: 'userId' });
    client.belongsTo(user, { foreignKey: 'userId' });
};

module.exports = relations;