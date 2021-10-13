'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
   
    await queryInterface.createTable("assign_lessons", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      assignmentTitle: {
        type: DataTypes.STRING(45),
        field: "title",
        allowNull: true,
      },
      lessonId: {
        type: DataTypes.INTEGER,
        field: "lesson_id",
        references: {
          model: "lessons",
          key: "id",
        },
      },
      recipeId: {
        type: DataTypes.INTEGER,
        field: "recipe_id",
        references: {
          model: "recipes",
          key: "id",
        },
      },
      classId: {
        type: DataTypes.INTEGER,
        field: "class_id",
        references: {
          model: "classes",
          key: "id",
        },
      },
      startDate: {
        type: DataTypes.DATE,
        field: "start_date",
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE,
        field: "end_date",
        allowNull: true,
      },
      defaultSetting: {
        type: DataTypes.BOOLEAN,
        field: "default_setting",
        defaultValue: true,
      },
      customSettingId: {
        type: DataTypes.INTEGER,
        field: "custom_setting_id",
        references: {
          model: "lesson_settings",
          key: "id",
        },
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
    await queryInterface.dropTable("assign_lessons");
  }
};
