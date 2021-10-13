"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("log_sessions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "role_id",
        references: {
          model: "roles",
          key: "id",
        },
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "entity_id",
      },
      signInAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "sign_in_at",
      },
      signOutAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "sign_out_at",
      },
      sessionMins: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "session_mins",
      },
      sessionToken: {
        type: DataTypes.STRING(256),
        allowNull: false,
        field: "session_token",
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
    await queryInterface.dropTable("log_sessions");
  },
};
