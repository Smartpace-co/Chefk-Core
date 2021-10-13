"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("student_lesson_progress", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "student_id",
        references: {
          model: "students",
          key: "id",
        },
      },
      assignLessonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "assign_lesson_id",
        references: {
          model: "assign_lessons",
          key: "id",
        },
      },
      currentScreen: {
        type: DataTypes.STRING(250),
        allowNull: true,
        field: "current_screen",
      },
      totalWorkMins: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "total_work_mins",
      },
      percentCompleted: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "percent_completed",
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "started_at",
      },
      endedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ended_at",
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
    await queryInterface.dropTable("student_lesson_progress");
  },
};
