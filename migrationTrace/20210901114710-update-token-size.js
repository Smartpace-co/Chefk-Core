"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("users", "token", { type: Sequelize.STRING(256) });
    await queryInterface.changeColumn("students", "token", { type: Sequelize.STRING(256) });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("users", "token", { type: Sequelize.STRING(145) });
    await queryInterface.changeColumn("students", "token", { type: Sequelize.STRING(145) });
  },
};
