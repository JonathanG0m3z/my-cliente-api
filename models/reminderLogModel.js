module.exports = (sequelize, DataTypes) => {
    const ReminderLog = sequelize.define("reminderLog", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
          },
          sent_at: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          to: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
          }
    },
    {
      timestamps: false,
    });
    return ReminderLog;
};