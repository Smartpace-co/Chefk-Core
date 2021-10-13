"use strict";
module.exports = (sequelize, DataTypes) => {
  const class_standard = sequelize.define(
    "class_standards",
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
      standard_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "standards",
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
  class_standard.associate = function (models) {
    // association goes here
    class_standard.belongsTo(models.classes, { foreignKey: "class_id" });
    class_standard.belongsTo(models.standards, { foreignKey: "standard_id" });

    //   school.belongsTo(models.user, {foreignKey: 'created_by'});
    //   school.belongsTo(models.user, {foreignKey: 'updated_by'});
  };

  return class_standard;
};
