module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('contests', [
      {
        contestType: 'name',
        status: 'active',
        prize: 100,
        priority: 1,
        orderId: 'contest 1',
        userId: 1,
      },
      {
        contestType: 'tagline',
        status: 'active',
        prize: 100,
        priority: 2,
        orderId: 'contest 2',
        userId: 1,
      },
      {
        contestType: 'logo',
        status: 'active',
        prize: 150,
        priority: 3,
        orderId: 'contest 3',
        userId: 1,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('contests', null, {});
  },
};
