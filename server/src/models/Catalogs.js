const { underscoredIf } = require('sequelize/lib/utils');

module.exports = (sequelize, DataTypes) => {
  const Catalogs = sequelize.define(
    'Catalogs',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
      catalogName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'catalog_name',
      },
    },
    {
      tableName: 'catalogs',
      timestamps: true,
      underscored: true,
    }
  );

  Catalogs.associate = models => {
    Catalogs.belongsTo(models.Users, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });

    Catalogs.belongsToMany(models.Conversations, {
      through: models.CatalogConversations,
      foreignKey: 'catalog_id',
      otherKey: 'conversation_id',
    });
  };

  return Catalogs;
};
