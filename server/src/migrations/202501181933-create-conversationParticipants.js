'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableExists = await queryInterface
      .describeTable('conversation_participants')
      .catch(() => false);

    if (!tableExists) {
      await queryInterface.createTable('conversation_participants', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
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
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'chat_users',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('conversation_participants');
  },
};
