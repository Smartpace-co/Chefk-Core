"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("experiments", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
      after: "lesson_id",
    });
    await queryInterface.addColumn("experiments", "fact", {
      type: Sequelize.TEXT,
      allowNull: true,
      after: "description",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("experiments", "description");
    await queryInterface.removeColumn("experiments", "fact");
  },
};
