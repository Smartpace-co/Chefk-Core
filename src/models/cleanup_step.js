"use strict";
module.exports = (sequelize, DataTypes) => {
  const cleanupStep = sequelize.define(
    "cleanup_steps",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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

      text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      image: {
        type: DataTypes.TEXT,
        allowNull: true,
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
  cleanupStep.associate = function (models) {
    cleanupStep.belongsTo(models.lessons, {
      foreignKey: "lessonId",
    });
  };

  return cleanupStep;
};
