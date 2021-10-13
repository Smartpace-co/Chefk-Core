"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "parent_role_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      // references: {
      //   model: "roles",
      //   key: "id",
      // },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "parent_role_id");
  },
};
