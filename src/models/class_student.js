"use strict";
module.exports = (sequelize, DataTypes) => {
  const class_student = sequelize.define(
    "class_students",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      classId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "class_id",
        references: {
          model: "classes",
          key: "id",
        },
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
  class_student.associate = function (models) { 
    // association goes here
    class_student.belongsTo(models.classes, { foreignKey: "class_id" });
    class_student.belongsTo(models.students, { foreignKey: "student_id" });

    //   school.belongsTo(models.user, {foreignKey: 'created_by'});
    //   school.belongsTo(models.user, {foreignKey: 'updated_by'});
  };

  return class_student;
};
