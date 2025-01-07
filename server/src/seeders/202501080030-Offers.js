module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Offers', [
      {
        userId: 1,
        contestId: 1,
        text: 'This is a test offer 1',
        isApproved: null,
      },
      {
        userId: 1,
        contestId: 2,
        text: 'This is a test offer 2',
        isApproved: true,
      },
      {
        userId: 1,
        contestId: 3,
        text: 'This is a test offer 3',
        isApproved: false,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Offers', null, {});
  },
};
