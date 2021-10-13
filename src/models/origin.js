"use strict";
module.exports = (sequelize, DataTypes) => {
  const origin = sequelize.define(
    "origins",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      originTitle: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: "title",
      },

      moduleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "module_id",
        references: {
          model: "module_master",
          key: "id",
        },
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
  origin.associate = function (models) {
    origin.belongsTo(models.module_master, {
      foreignKey: "moduleId",
    });
  };

  return origin;
};
