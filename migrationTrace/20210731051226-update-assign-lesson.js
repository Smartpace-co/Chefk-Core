"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("assign_lessons", "self_assigned_by", {
      type: Sequelize.INTEGER,
      field: "self_assigned_by",
      allowNull: true,
      references: {
        model: "students",
        key: "id",
      },
      after: "class_id",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("assign_lessons", "self_assigned_by");
  },
};
