"use strict";
module.exports = (sequelize, DataTypes) => {
  const assignLesson = sequelize.define(
    "assign_lessons",
    {
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
      selfAssignedBy: {
        type: DataTypes.INTEGER,
        field: "self_assigned_by",
        allowNull: true,
        references: {
          model: "students",
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
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: "deleted_at",
      },
      archivedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: "archived_at",
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      underscored: true,
    }
  );

  assignLesson.associate = function (models) {
    assignLesson.belongsTo(models.lessons, { foreignKey: "lessonId" });
    assignLesson.belongsTo(models.recipes, { foreignKey: "recipeId" });
    assignLesson.belongsTo(models.classes, { foreignKey: "classId" });
    assignLesson.belongsTo(models.lesson_settings, { foreignKey: "customSettingId", as: "customSetting" });
    // assignLesson.belongsTo(models.class_students, { foreignKey: "classId" });
    assignLesson.hasOne(models.student_lesson_progress, { foreignKey: "assignLessonId", as: "studentProgress" });
    assignLesson.hasMany(models.student_lesson_progress, { foreignKey: "assignLessonId", as: "studentProgressList" });
    assignLesson.hasMany(models.student_lesson_answers, { foreignKey: "assignLessonId", as: "studentLessonAnswers" });

  };

  return assignLesson;
};
