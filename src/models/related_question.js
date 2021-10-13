"use strict";
module.exports = (sequelize, DataTypes) => {
  const relatedQuestion = sequelize.define(
    "related_questions",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      transactionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "transaction_id",
        // references: {
        //   model: "module_master",
        //   key: "id",
        // },
      },

      moduleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "module_id",
        references: {
          model: "module_master",
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
  relatedQuestion.associate = function (models) {
    relatedQuestion.belongsTo(models.module_master, {
      foreignKey: "moduleId",
    });
    relatedQuestion.belongsTo(models.tools, {
      foreignKey: "transactionId",
    });
    relatedQuestion.belongsTo(models.nutrients, {
      foreignKey: "transactionId",
    });
  };

  return relatedQuestion;
};
