'use strict';
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'moderatorfn',
          lastName: 'moderatorln',
          displayName: 'moderatordn',
          password: bcrypt.hashSync('123456', SALT_ROUNDS),
          email: 'moderator@gmail.com',
          role: 'moderator',
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'Users',
      {
        email: 'moderator@gmail.com',
      },
      {}
    );
  },
};
