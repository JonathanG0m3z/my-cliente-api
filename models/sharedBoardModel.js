module.exports = (sequelize, DataTypes) => {
  const SharedBoard = sequelize.define("sharedBoard", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    users: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  });
  return SharedBoard;
};