module.exports = (sequelize, DataTypes) => {
    const Price = sequelize.define("price", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true,
          },
          price: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          userId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
          serviceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
    },
    {
      timestamps: false,
    });
    return Price;
};