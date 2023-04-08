module.exports = (sequelize, DataTypes) => {
    const Sale = sequelize.define("sale", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true,
          },
          price: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          expiration: {
            type: DataTypes.DATEONLY,
            allowNull: false,
          },
          saleDate: {
            type: DataTypes.DATEONLY,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          },
          accountId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          userId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
          clientId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
    },
    {
      timestamps: false,
    });
    return Sale;
};