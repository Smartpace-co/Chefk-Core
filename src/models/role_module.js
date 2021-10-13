"use strict";
module.exports = (sequelize, DataTypes) => {
  const role_module = sequelize.define(
    "role_modules",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
      },

      module_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "access_modules",
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
  role_module.associate = function (models) {
    role_module.belongsTo(models.roles, { foreignKey: "role_id" });
    role_module.belongsTo(models.access_modules, { foreignKey: "module_id" });
  };

  return role_module;
};
