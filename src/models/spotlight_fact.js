"use strict";
module.exports = (sequelize, DataTypes) => {
  const spotlightFact = sequelize.define(
    "spotlight_facts",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      fact: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      recipeIngredientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "recipe_ingredient_id",
        references: {
          model: "ingredients",
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
  spotlightFact.associate = function (models) {
    spotlightFact.belongsTo(models.recipe_ingredients, {
      foreignKey: "recipeIngredientId",
      onDelete: "CASCADE",
    });
  };

  return spotlightFact;
};
