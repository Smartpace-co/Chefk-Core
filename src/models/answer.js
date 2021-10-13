"use strict";
module.exports = (sequelize, DataTypes) => {
  const answers = sequelize.define(
    "answers",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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

      option: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      isAnswer: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_answer",
      },

      image: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      isDelete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_delete",
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
  answers.associate = function (models) {
    answers.belongsTo(models.questions, {
      foreignKey: "questionId",
    });
  };

  return answers;
};
