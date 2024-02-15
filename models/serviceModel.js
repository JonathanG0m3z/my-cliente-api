module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define("service", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          userId: {
            type: DataTypes.UUID,
            allowNull: true,
          },
    },
    {
      timestamps: false,
    });
    return Service;
};