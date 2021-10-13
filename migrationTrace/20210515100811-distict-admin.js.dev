"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("district_admins", "display_name", {
      type: Sequelize.STRING(45),
      allowNull: true,
    });
    await queryInterface.addColumn("district_admins", "district_image", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("district_admins", "admin_address", {
      type: Sequelize.STRING(250),
      allowNull: true,
    });
    await queryInterface.addColumn("district_admins", "admin_gender", {
      type: Sequelize.STRING(15),
      allowNull: true,
    });
    await queryInterface.addColumn("district_admins", "district_phone_no", {
      type: Sequelize.STRING(45),
      allowNull: true,
    });
    await queryInterface.addColumn("district_admins", "contact_person_image", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("district_admins", "contact_person_title", {
      type: Sequelize.STRING(45),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("district_admins", "display_name");
    await queryInterface.removeColumn("district_admins", "district_image");
    await queryInterface.removeColumn("district_admins", "admin_address");
    await queryInterface.removeColumn("district_admins", "admin_gender");
    await queryInterface.removeColumn("district_admins", "district_phone_no");
    await queryInterface.removeColumn("district_admins", "contact_person_image");
    await queryInterface.removeColumn("district_admins", "contact_person_title");
  },
};
