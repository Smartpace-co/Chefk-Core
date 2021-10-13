"use strict";
module.exports = (sequelize, DataTypes) => {
  const grade = sequelize.define("grades", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },

    grade: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
        field: "created_by",
      },
    },

    updated_by: {
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
  });
  grade.associate = function (models) {
    grade.hasMany(models.classes, { foreignKey: "grade_id" });
    grade.hasOne(models.students, { foreignKey: "grade_id" });
  };

  return grade;
};
