"use strict";
module.exports = (sequelize, DataTypes) => {
  const class_standard_subject_group = sequelize.define(
    "class_standard_subject_groups",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "classes",
          key: "id",
        },
      },
      subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "subjects",
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
  class_standard_subject_group.associate = function (models) {
    // association goes here
    class_standard_subject_group.belongsTo(models.classes, { foreignKey: "class_id" });
    class_standard_subject_group.belongsTo(models.subjects, { foreignKey: "subject_id" });

    //   school.belongsTo(models.user, {foreignKey: 'created_by'});
    //   school.belongsTo(models.user, {foreignKey: 'updated_by'});
  };

  return class_standard_subject_group;
};