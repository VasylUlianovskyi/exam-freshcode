'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableExists = await queryInterface
      .describeTable('messages')
      .catch(() => false);

    if (!tableExists) {
      await queryInterface.createTable('messages', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        body: {
          type: Sequelize.TEXT,
          allowNull: false,
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
        sender_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'chat_users',
            key: 'id',
          },
          onDelete: 'CASCADE',
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
    await queryInterface.dropTable('messages');
  },
};
