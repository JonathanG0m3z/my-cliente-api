module.exports = (sequelize, DataTypes) => {
    const Sale = sequelize.define("sale", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
          },
          price: {
            type: DataTypes.integer,
            allowNull: false,
          },
          expiration: {
            type: DataTypes.DATEONLY,
            allowNull: false,
          },
    });
};