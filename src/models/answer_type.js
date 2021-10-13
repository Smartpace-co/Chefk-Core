"use strict";
module.exports = (sequelize, DataTypes) => {
  const answerType = sequelize.define(
    "answer_types",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      title: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },

      key: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
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
  answerType.associate = function (models) {
    answerType.hasMany(models.questions, {
      foreignKey: "answerTypeId",
    });  };

  return answerType;
};
