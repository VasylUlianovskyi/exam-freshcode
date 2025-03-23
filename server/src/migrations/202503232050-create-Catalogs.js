'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableExists = await queryInterface
      .describeTable('catalogs')
      .catch(() => false);

    if (!tableExists) {
      await queryInterface.createTable('catalogs', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        catalog_name: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW'),
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW'),
        },
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('catalogs');
  },
};
