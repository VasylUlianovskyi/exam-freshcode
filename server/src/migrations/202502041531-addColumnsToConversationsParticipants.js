module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('conversation_participants', 'blacklist', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('conversation_participants', 'blacklist');
  },
};
