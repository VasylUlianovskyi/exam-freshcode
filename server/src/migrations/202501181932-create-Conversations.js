'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableExists = await queryInterface
      .describeTable('conversations')
      .catch(() => false);

    if (!tableExists) {
      await queryInterface.createTable('conversations', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        blacklist: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        favorite_list: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
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
    await queryInterface.dropTable('conversations');
  },
};
