module.exports = (sequelize, DataTypes) => {
    const Sale = sequelize.define("sale", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
          },
          price: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          expiration: {
            type: DataTypes.DATEONLY,
            allowNull: false,
          },
          profile: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          pin: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          renewed: {
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
          clientId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
    },
    {
      timestamps: true,
    });
    return Sale;
};