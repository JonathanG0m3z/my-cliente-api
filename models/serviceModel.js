module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define("service", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
    });
};