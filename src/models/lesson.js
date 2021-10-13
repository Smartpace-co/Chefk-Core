"use strict";
module.exports = (sequelize, DataTypes) => {
  const lesson = sequelize.define(
    "lessons",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      lessonTitle: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
        field: "title",
      },

      creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "creator_id",
        references: {
          model: "users",
          key: "id",
        },
      },

      learningObjectivesForTeacher: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "learning_objectives_for_teacher",
      },

      learningObjectivesForStudent: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "learning_objectives_for_student",
      },

      greeting: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      linguistic: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      // multiSensoryActivity: {
      //   type: DataTypes.TEXT,
      //   allowNull: true,
      //   field: "multi_sensory_activity",
      // },

      // cleanUpStep: {
      //   type: DataTypes.TEXT,
      //   allowNull: true,
      //   field: "clean_up_step",
      // },

      funFact: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "fun_fact",
      },

      socialStudiesFact: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "social_studies_fact",
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

      // typeId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   field: "type_id",
      //   references: {
      //     model: "types",
      //     key: "id",
      //   },
      // },

      languageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "language_id",
        references: {
          model: "users",
          key: "id",
        },
      },

      isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_featured",
      },

      storyTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "story_time",
      },

      assessmentTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "assessment_time",
      },

      goodbye: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      goodbyeLinguistic: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "goodbye_linguistic",
      },

      greetingTrack: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "greeting_track",
      },

      goodbyeTrack: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "goodbye_track",
      },

      learningObjectivesForTeacherTrack: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "learning_objectives_for_teacher_track",
      },

      learningObjectivesForStudentTrack: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "learning_objectives_for_student_track",
      },

      safetyStepsTrack: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "safety_steps_track",
      },

      cleanupStepsTrack: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "cleanup_steps_track",
      },

      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      createdBy: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
          field: "created_by",
        },
      },

      updatedBy: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
          field: "updated_by",
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
  lesson.associate = function (models) {
    // lesson.belongsTo(models.types, {
    //   foreignKey: "typeId",
    // });
    lesson.belongsTo(models.grades, {
      foreignKey: "gradeId",
    });

    lesson.belongsTo(models.users, {
      foreignKey: "creatorId",
    });
    lesson.hasMany(models.safety_steps, {
      foreignKey: "lessonId",
      as: "safetySteps",
    });
    lesson.hasMany(models.chef_introductions, {
      foreignKey: "lessonId",
      as: "chefIntroductions",
    });
    lesson.hasOne(models.recipes, {
      foreignKey: "lessonId",
    });

    lesson.hasOne(models.teacher_instructions, {
      foreignKey: "lessonId",
      as: "teacherInstructions"
    });

    lesson.hasOne(models.experiments, {
      foreignKey: "lessonId",
    });
    lesson.hasOne(models.activities, {
      foreignKey: "lessonId",
    });
    lesson.hasMany(models.lesson_links, {
      foreignKey: "lessonId",
      as: "links",
    });
    lesson.hasMany(models.questions, {
      foreignKey: "transaction_id",
    });
    lesson.hasOne(models.questions, {
      foreignKey: "transaction_id",
      as: "multiSensoryQuestions",
    });
    lesson.belongsTo(models.languages, {
      foreignKey: "languageId",
    });
    lesson.hasMany(models.cleanup_steps, {
      foreignKey: "lessonId",
      as: "cleanupSteps",
    });
    lesson.hasMany(models.bookmark_lessons, {
      foreignKey: "lessonId",
      as: "bookmarkLesson",
    });
  };

  return lesson;
};
