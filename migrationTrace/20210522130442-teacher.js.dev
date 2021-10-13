"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("teachers", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
        references: {
          model: "users",
          key: "id",
        },
      },
      district_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "district_admins",
          key: "id",
        },
      },
      school_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "schools",
          key: "id",
        },
      },
      first_name: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      contact_person_image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      contact_person_name: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      contact_person_number: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      contact_person_email: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      contact_person_gender: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      emergency_contact_number: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      package_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // references: {
        //   model: "packages",
        //   key: "id",
        // },
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
    await queryInterface.dropTable("teachers");
  },
};
