'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Users_role" ADD VALUE 'moderator';
    `);
  },

  async down (queryInterface, Sequelize) {},
};
