module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define("order", {
        merchantTradeNo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          prepayId: {
            type: DataTypes.BIGINT,
            allowNull: true,
          },
          qrcodeLink: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          checkoutUrl: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          months: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          finished: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
          },
          accountId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
          userId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
    },
    {
      timestamps: true,
    });
    return Order;
};