"use strict";
module.exports = (sequelize, DataTypes) => {
  const studentHealthHygiene = sequelize.define(
    "student_health_hygiene",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "student_id",
        references: {
          model: "students",
          key: "id",
        },
      },
      healthHygieneId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "health_hygiene_id",
        references: {
          model: "health_hygienes",
          key: "id",
        },
      },
      answer: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    },
    {
      timestamps: true,
      freezeTableName: true,
      underscored: true,
    }
  );
  studentHealthHygiene.associate = function (models) {};

  return studentHealthHygiene;
};
