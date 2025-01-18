module.exports = (sequelize, DataTypes) => {
  const ChatUsers = sequelize.define('ChatUsers', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
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

  ChatUsers.associate = models => {
    ChatUsers.belongsTo(models.Users, {
      foreignKey: 'userId',
      targetKey: 'id',
    });

    ChatUsers.hasMany(models.Messages, {
      foreignKey: 'senderId',
    });

    ChatUsers.hasMany(models.ConversationParticipants, {
      foreignKey: 'userId',
    });
  };

  return ChatUsers;
};
