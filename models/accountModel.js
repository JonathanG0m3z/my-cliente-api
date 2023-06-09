module.exports = (sequelize, DataTypes) => {
    const Account = sequelize.define("account", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true,
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          expiration: {
            type: DataTypes.DATEONLY,
            allowNull: false,
          },
          profiles: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          serviceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          userId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
    },
    {
      timestamps: false,
    });
    return Account;
};