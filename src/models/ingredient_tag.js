"use strict";
module.exports = (sequelize, DataTypes) => {
  const ingredientTag = sequelize.define(
    "ingredient_tags",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      ingredientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "ingredient_id",
        references: {
          model: "ingredients",
          key: "id",
        },
      },

      tagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "tag_id",
        references: {
          model: "tags",
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
  ingredientTag.associate = function (models) {
    ingredientTag.belongsTo(models.ingredients, {
      foreignKey: "ingredientId",
      as: "tags",
    });
    ingredientTag.belongsTo(models.tags, {
      foreignKey: "tagId",
    });
  };

  return ingredientTag;
};
