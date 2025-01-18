module.exports = (sequelize, DataTypes) => {
  const Conversations = sequelize.define(
    'Conversations',
    {
      blacklist: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      favoriteList: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      underscored: true,
    }
  );

  Conversations.associate = models => {
    Conversations.hasMany(models.Messages, {
      foreignKey: 'conversationId',
      onDelete: 'CASCADE',
    });

    Conversations.hasMany(models.ConversationParticipants, {
      foreignKey: 'conversationId',
      onDelete: 'CASCADE',
    });
  };

  return Conversations;
};
