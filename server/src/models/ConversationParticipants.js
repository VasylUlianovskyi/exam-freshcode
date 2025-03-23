module.exports = (sequelize, DataTypes) => {
  const ConversationParticipants = sequelize.define(
    'ConversationParticipants',
    {
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'conversation_id',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
      blacklist: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      favoriteList: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'favorite_list',
      },
    },
    {
      tableName: 'conversation_participants',

      timestamps: false,
    }
  );

  ConversationParticipants.associate = models => {
    ConversationParticipants.belongsTo(models.Conversations, {
      foreignKey: 'conversation_id',
      onDelete: 'CASCADE',
    });

    ConversationParticipants.belongsTo(models.Users, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
  };

  return ConversationParticipants;
};
