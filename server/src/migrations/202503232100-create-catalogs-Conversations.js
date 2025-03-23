'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableExists = await queryInterface
      .describeTable('catalog_conversations')
      .catch(() => false);

    if (!tableExists) {
      await queryInterface.createTable('catalog_conversations', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        catalog_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'catalogs',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        conversation_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'conversations',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('catalog_conversations');
  },
};
