module.exports = (sequelize, DataTypes) => {
    const Price = sequelize.define("price", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
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
            type: DataTypes.UUID,
            allowNull: false,
          },
    },
    {
      timestamps: false,
    });
    return Price;
};