"use strict";
module.exports = (sequelize, DataTypes) => {
  const class_teacher = sequelize.define(
    "class_teachers",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      class_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "classes",
          key: "id",
        },
      },
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "teachers",
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
  class_teacher.associate = function (models) {
    // association goes here
    class_teacher.belongsTo(models.classes, { foreignKey: "class_id" });
    class_teacher.belongsTo(models.teachers, { foreignKey: "teacher_id" });
    //   school.belongsTo(models.user, {foreignKey: 'created_by'});
    //   school.belongsTo(models.user, {foreignKey: 'updated_by'});
  };

  return class_teacher;
};
