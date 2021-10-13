"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("students", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userName: {
        type: DataTypes.STRING(45),
        unique: true,
        field: "user_name",
      },
      districtId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "district_id",
        references: {
          model: "district_admins",
          key: "id",
        },
      },
      schoolId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "school_id",
        references: {
          model: "schools",
          key: "id",
        },
      },
      gradeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "grade_id",
        references: {
          model: "grades",
          key: "id",
        },
      },
      firstName: {
        type: DataTypes.STRING(45),
        field: "first_name",
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING(45),
        field: "last_name",
        allowNull: true,
      },
      dob: {
        type: DataTypes.DATE(),
        allowNull: null,
      },
      profileImage: {
        type: DataTypes.TEXT,
        field: "profile_image",
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
      ethnicityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "ethnicity_id",
        references: {
          model: "ethnicities",
          key: "id",
        },
      },
      allergens: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      contactType: {
        type: DataTypes.ENUM("parent", "guardian"),
        field: "contact_type",
      },
      contactPersonEmail: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: "contact_person_email",
      },
      contactPersonNumber: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: "contact_person_number",
      },
      contactPersonName: {
        type: DataTypes.STRING(45),
        field: "contact_person_name",
        allowNull: true,
      },
      contactPersonRelationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "contact_person_relation_id",
        references: {
          model: "relations",
          key: "id",
        },
      },
      contactPersonGender: {
        type: DataTypes.STRING(15),
        field: "contact_person_gender",
        allowNull: true,
      },
      emergencyContactNumber: {
        type: DataTypes.STRING(45),
        field: "emergency_contact_number",
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      packageId: {
        type: DataTypes.INTEGER,
        field: "package_id",
        allowNull: true,
        // references: {
        //   model: "packages",
        //   key: "id",
        // },
      },
      password: {
        type: DataTypes.STRING(145),
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING(145),
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_email_verified",
      },
      isPhoneVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_phone_verified",
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
    await queryInterface.dropTable("students");
  },
};
