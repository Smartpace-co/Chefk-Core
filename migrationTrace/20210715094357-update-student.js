"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("students", "address");
    await queryInterface.removeColumn("students", "allergens");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("students", "address", {
      type: Sequelize.STRING(250),
      allowNull: true,
    });
    await queryInterface.addColumn("students", "allergens", {
      type: Sequelize.STRING(250),
      allowNull: true,
    });
  },
};
