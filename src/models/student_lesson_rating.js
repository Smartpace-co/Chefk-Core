"use strict";
module.exports = (sequelize, DataTypes) => {
  const studentLessonProgress = sequelize.define(
    "student_lesson_ratings",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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

      lessonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "lesson_id",
        references: {
          model: "lessons",
          key: "id",
        },
      },

      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    },
    {
      timestamps: true,
      freezeTableName: true,
      underscored: true,
    }
  );
  studentLessonProgress.associate = function (models) {
    studentLessonProgress.belongsTo(models.assign_lessons, {
      foreignKey: "assignLessonId",
    });
    studentLessonProgress.belongsTo(models.lessons, {
      foreignKey: "lessonId",
    });
  };

  return studentLessonProgress;
};
