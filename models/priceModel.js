module.exports = (sequelize, DataTypes) => {
    const Price = sequelize.define("price", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
          },
          price: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
    });
};