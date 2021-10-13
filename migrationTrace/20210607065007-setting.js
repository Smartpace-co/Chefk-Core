"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("settings", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "entity_id",
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "role_id",
        // references: {
        //   model: "roles",
        //   key: "id",
        // },
      },
      key: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      isEnable: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "is_enable",
      },
      content: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        field: "created_by",
        references: {
          model: "users",
          key: "id",
        },
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        field: "updated_by",
        references: {
          model: "users",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "created_at",
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "updated_at",
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("settings");
  },
};
