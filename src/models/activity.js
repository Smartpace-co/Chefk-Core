"use strict";
module.exports = (sequelize, DataTypes) => {
  const activity = sequelize.define(
    "activities",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      activityTitle: {
        type: DataTypes.STRING(45),
        allowNull: false,
        // unique: true,
        field: "title",
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "description",
      },

      image: {
        type: DataTypes.TEXT,
        allowNull: true,
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

      estimatedTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "estimated_time",
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
  activity.associate = function (models) {
    activity.belongsTo(models.lessons, {
      foreignKey: "lessonId",
    });
    activity.hasMany(models.questions, {
      foreignKey: "transaction_id",
      as: "activityQuestions",
    });
  };

  return activity;
};
