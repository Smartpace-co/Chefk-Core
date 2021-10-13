"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("ethnicities", [
      {
        title: "American Indian",
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Asian",
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "African American",
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Hispanic",
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Native Hawaiian",
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "British",
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("ethnicities", null, {});
  },
};
