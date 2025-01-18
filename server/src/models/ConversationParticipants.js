module.exports = (sequelize, DataTypes) => {
  const ConversationParticipants = sequelize.define(
    'ConversationParticipants',
    {
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }
  );

  ConversationParticipants.associate = models => {
    ConversationParticipants.belongsTo(models.Conversations, {
      foreignKey: 'conversationId',
      onDelete: 'CASCADE',
    });

    ConversationParticipants.belongsTo(models.ChatUsers, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };

  return ConversationParticipants;
};
