module.exports = (sequelize, DataTypes) => {
  const Conversations = sequelize.define(
    'Conversations',
    {
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      tableName: 'conversations',
      timestamps: true,
    }
  );

  Conversations.associate = models => {
    Conversations.hasMany(models.Messages, {
      foreignKey: 'conversation_id',

      onDelete: 'CASCADE',
    });

    Conversations.hasMany(models.ConversationParticipants, {
      foreignKey: 'conversation_id',
      as: 'participants',
      onDelete: 'CASCADE',
    });

    Conversations.belongsToMany(models.Catalogs, {
      through: models.CatalogConversations,
      foreignKey: 'conversation_id',
      otherKey: 'catalog_id',
    });
  };

  return Conversations;
};
