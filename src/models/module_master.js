"use strict";
module.exports = (sequelize, DataTypes) => {
  const moduleMaster = sequelize.define(
    "module_master",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      moduleKey: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
        field: "module_key",
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
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
  moduleMaster.associate = function (models) {
    moduleMaster.hasMany(models.categories, {
      foreignKey: "moduleId",
    });
    moduleMaster.hasMany(models.types, {
      foreignKey: "moduleId",
    });
    moduleMaster.hasMany(models.origins, {
      foreignKey: "moduleId",
    });
    moduleMaster.hasMany(models.uses, {
      foreignKey: "moduleId",
    });
  };

  return moduleMaster;
};
