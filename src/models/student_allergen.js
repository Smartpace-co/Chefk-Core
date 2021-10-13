"use strict";
module.exports = (sequelize, DataTypes) => {
  const studentAllergen = sequelize.define(
    "student_allergens",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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

      allergenId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "allergen_id",
        references: {
          model: "allergens",
          key: "id",
        },
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
  studentAllergen.associate = function (models) {
    studentAllergen.belongsTo(models.allergens, { foreignKey: "allergenId" });
    studentAllergen.belongsTo(models.students, { foreignKey: "studentId", as: "allergens" });
  };

  return studentAllergen;
};
