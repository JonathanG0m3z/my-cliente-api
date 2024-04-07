module.exports = (sequelize, DataTypes) => {
    const Account = sequelize.define("account", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
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
          deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          serviceId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
          userId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
          sharedBoardId: {
            type: DataTypes.UUID,
            allowNull: true,
          },
    },
    {
      timestamps: false,
    });
    return Account;
};