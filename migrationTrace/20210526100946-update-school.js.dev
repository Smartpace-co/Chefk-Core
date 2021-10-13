"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn("schools", "display_name", {
      type: DataTypes.STRING(45),
      allowNull: true,
    });
    await queryInterface.addColumn("schools", "admin_address", {
      type: DataTypes.STRING(250),
      allowNull: true,
    });
    await queryInterface.addColumn("schools", "admin_gender", {
      type: DataTypes.STRING(15),
      allowNull: true,
    });
    await queryInterface.addColumn("schools", "school_image", {
      type: DataTypes.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("schools", "school_phone_no", {
      type: DataTypes.STRING(45),
      allowNull: true,
    });
    await queryInterface.addColumn("schools", "contact_person_image", {
      type: DataTypes.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("schools", "contact_person_gender", {
      type: DataTypes.STRING(15),
      allowNull: true,
    });
    await queryInterface.addColumn("schools", "contact_person_title", {
      type: DataTypes.STRING(45),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("schools", "display_name");
    await queryInterface.removeColumn("schools", "admin_address");
    await queryInterface.removeColumn("schools", "admin_gender");
    await queryInterface.removeColumn("schools", "school_image");
    await queryInterface.removeColumn("schools", "school_phone_no");
    await queryInterface.removeColumn("schools", "contact_person_image");
    await queryInterface.removeColumn("schools", "contact_person_gender");
    await queryInterface.removeColumn("schools", "contact_person_title");
  },
};
