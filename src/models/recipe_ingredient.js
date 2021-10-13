"use strict";
module.exports = (sequelize, DataTypes) => {
  const recipeIngredient = sequelize.define(
    "recipe_ingredients",
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

      ingredientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "ingredient_id",
        references: {
          model: "ingredients",
          key: "id",
        },
      },

      unitOfMeasurementId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "unit_of_measurement_id",
        references: {
          model: "unit_of_measurements",
          key: "id",
        },
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      quickBlurbText: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "quick_blurb_text",
      },

      quickBlurbImage: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "quick_blurb_image",
      },

      isOptional: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_optional",
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
  recipeIngredient.associate = function (models) {

    recipeIngredient.belongsTo(models.recipes, {
      foreignKey: "recipeId",
    });
    recipeIngredient.belongsTo(models.ingredients, {
      foreignKey: "ingredientId",
    });
    recipeIngredient.belongsTo(models.unit_of_measurements, {
      foreignKey: "unitOfMeasurementId",
      as : "unitOfMeasurement"
    });
    recipeIngredient.hasMany(models.spotlight_facts, {
      foreignKey: "recipeIngredientId",
      as: "spotlightFacts",
      // onDelete: "CASCADE",
    });
  };

  return recipeIngredient;
};
