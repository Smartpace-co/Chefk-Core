"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("student_lesson_answers", {
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
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "question_id",
        references: {
          model: "questions",
          key: "id",
        },
      },
      answerTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "answer_type_id",
        references: {
          model: "answer_types",
          key: "id",
        },
      },
      answerIds: {
        type: DataTypes.JSON,
        allowNull: true,
        field: "answer_ids",
      },
      essay: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "is_correct",
      },
      isActivityAction: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_Activity_Action",
      },
      pointsEarned: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        field: "points_earned",
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
    await queryInterface.dropTable("student_lesson_answers");
  },
};
