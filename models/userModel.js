module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          password: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          phone: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
          picture: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          google_account: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
          },
          permission: {
            type: DataTypes.STRING,
            allowNull: true,
          }
    });
    return User;
};