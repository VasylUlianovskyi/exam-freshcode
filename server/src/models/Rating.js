module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    'Ratings',
    {
      offerId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      mark: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 5,
        },
      },
    },
    {
      tableName: 'Ratings',
      timestamps: false,
    }
  );

  Rating.associate = function (models) {
    Rating.belongsTo(models.Users, {
      foreignKey: 'userId',
      targetKey: 'id',
    });

    Rating.belongsTo(models.Offers, {
      foreignKey: 'offerId',
      targetKey: 'id',
    });
  };

  return Rating;
};
