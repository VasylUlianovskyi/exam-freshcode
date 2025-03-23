module.exports = (sequelize, DataTypes) => {
  const CatalogConversations = sequelize.define(
    'CatalogConversations',
    {
      catalogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'catalog_id',
        references: {
          model: 'catalogs',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'conversation_id',
        references: {
          model: 'conversations',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    },
    {
      tableName: 'catalog_conversations',
      underscored: true,
      timestamps: false,
    }
  );

  CatalogConversations.associate = models => {
    CatalogConversations.belongsTo(models.Catalogs, {
      foreignKey: 'catalog_id',
    });

    CatalogConversations.belongsTo(models.Conversations, {
      foreignKey: 'conversation_id',
    });
  };

  return CatalogConversations;
};
