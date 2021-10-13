"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("district_users", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "user_id",
        references: {
          model: "users",
          key: "id",
        },
      },
      district_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "district_admins",
          key: "id",
        },
      },
      first_name: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      last_name: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      package_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // references: {
        //   model: "packages",
        //   key: "id",
        // },
      },
      createdBy: {
        type: Sequelize.INTEGER,
        field: "created_by",
        references: {
          model: "users",
          key: "id",
        },
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        field: "updated_by",
        references: {
          model: "users",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "created_at",
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "updated_at",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("district_users");
  },
};
