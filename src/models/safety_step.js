"use strict";
module.exports = (sequelize, DataTypes) => {
  const safetyStep = sequelize.define(
    "safety_steps",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      text: {
        type: DataTypes.TEXT,
        allowNull: false,
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
  safetyStep.associate = function (models) {
    safetyStep.belongsTo(models.lessons, {
      foreignKey: "lessonId",
      as: "safetySteps",
    });
  };

  return safetyStep;
};
