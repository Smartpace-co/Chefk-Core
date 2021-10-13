"use strict";
module.exports = (sequelize, DataTypes) => {
  const questionStandard = sequelize.define(
    "question_standards",
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

      standardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "standard_id",
        references: {
          model: "standards",
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
  questionStandard.associate = function (models) {
    questionStandard.belongsTo(models.questions, {
      foreignKey: "questionId",
    });
    questionStandard.belongsTo(models.standards, {
      foreignKey: "standardId",
    });

  };

  return questionStandard;
};
