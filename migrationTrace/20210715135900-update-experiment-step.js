"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("experiment_steps", "image", {
      type: Sequelize.TEXT,
      allowNull: true,
      after: "text",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("experiment_steps", "image");
  },
};
