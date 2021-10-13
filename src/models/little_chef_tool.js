"use strict";
module.exports = (sequelize, DataTypes) => {
  const littleChefTool = sequelize.define(
    "little_chef_tools",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "recipe_id",
        references: {
          model: "recipes",
          key: "id",
        },
      },

      toolId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "tool_id",
        references: {
          model: "tools",
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

  littleChefTool.associate = function (models) {
    littleChefTool.belongsTo(models.recipes, {
      foreignKey: "recipeId",
    });
    littleChefTool.belongsTo(models.tools, {
      foreignKey: "toolId",
    });
  };

  return littleChefTool;
};
