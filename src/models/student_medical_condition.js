"use strict";
module.exports = (sequelize, DataTypes) => {
  const studentMedicalCondition = sequelize.define(
    "student_medical_conditions",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "student_id",
        references: {
          model: "students",
          key: "id",
        },
      },
      medicalConditionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "medical_conditon_id",
        references: {
          model: "medical_conditions",
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
  studentMedicalCondition.associate = function (models) {
    // association goes here
    studentMedicalCondition.belongsTo(models.medical_conditions, { foreignKey: "medical_conditon_id" });
    //   school.belongsTo(models.user, {foreignKey: 'created_by'});
    //   school.belongsTo(models.user, {foreignKey: 'updated_by'});
  };

  return studentMedicalCondition;
};
