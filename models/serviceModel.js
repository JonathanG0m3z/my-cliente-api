module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define("service", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
    },
    {
      timestamps: false,
    });
    return Service;
};