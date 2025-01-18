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
  return ConversationParticipants;
};
