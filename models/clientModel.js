module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define("client", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          phone: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          email: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          country: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          deleted_at: {
            type: DataTypes.DATEONLY,
            allowNull: true,
          },
          inactive: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
          },
          userId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
    },
    {
      timestamps: false,
    });
    return Client;
};