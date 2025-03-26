module.exports = (sequelize, DataTypes) => {
  const Messages = sequelize.define(
    'Messages',
    {
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'conversation_id',
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'sender_id',
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_read',
      },

      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
      },
    },
    {
      tableName: 'messages',
      timestamps: true,
    }
  );

  Messages.associate = models => {
    Messages.belongsTo(models.Conversations, {
      foreignKey: 'conversation_id',
      onDelete: 'CASCADE',
    });

    Messages.belongsTo(models.Users, {
      foreignKey: 'sender_id',
      onDelete: 'CASCADE',
    });
  };

  return Messages;
};
