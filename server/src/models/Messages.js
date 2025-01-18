module.exports = (sequelize, DataTypes) => {
  const Messages = sequelize.define('Messages', {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  Messages.associate = models => {
    Messages.belongsTo(models.Conversations, {
      foreignKey: 'conversationId',
      onDelete: 'CASCADE',
    });

    Messages.belongsTo(models.ChatUsers, {
      foreignKey: 'senderId',
      onDelete: 'CASCADE',
    });
  };

  return Messages;
};
