'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
       ALTER TYPE enum_users_role ADD VALUE IF NOT EXISTS 'moderator';
    `);
  },

  async down (queryInterface, Sequelize) {},
};
