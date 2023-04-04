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
          accountId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          userId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
          saleDate: {
            type: DataTypes.DATEONLY,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          }
    },
    {
      timestamps: false,
    });
    return Sale;
};