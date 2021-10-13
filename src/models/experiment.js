"use strict";
module.exports = (sequelize, DataTypes) => {
  const experiment = sequelize.define(
    "experiments",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      experimentTitle: {
        type: DataTypes.STRING(45),
        allowNull: false,
        // unique: true,
        field: "title",
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      fact: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      estimatedMakeTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "estimated_make_time",
      },
      experimentStepsTrack: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "experiment_steps_track",
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
  experiment.associate = function (models) {
    experiment.belongsTo(models.lessons, {
      foreignKey: "lessonId",
    });
    experiment.hasMany(models.experiment_tools, {
      foreignKey: "experimentId",
      as: "experimentTools",
    });
    experiment.hasMany(models.experiment_ingredients, {
      foreignKey: "experimentId",
      as: "experimentIngredients",
    });
    experiment.hasMany(models.experiment_techniques, {
      foreignKey: "experimentId",
      as: "experimentTechniques",
    });
    experiment.hasMany(models.experiment_steps, {
      foreignKey: "experimentId",
      as: "experimentSteps",
    });
    experiment.hasMany(models.questions, {
      foreignKey: "transaction_id",
      as: "experimentQuestions",
    });
  };

  return experiment;
};
