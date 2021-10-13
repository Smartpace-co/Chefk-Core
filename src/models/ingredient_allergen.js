"use strict";
module.exports = (sequelize, DataTypes) => {
  const ingredientAllergen = sequelize.define(
    "ingredient_allergens",
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

      allergenId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "allergen_id",
        references: {
          model: "allergens",
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
  ingredientAllergen.associate = function (models) {
    ingredientAllergen.belongsTo(models.ingredients, {
      foreignKey: "ingredientId",
      as: "allergens",
    });
    ingredientAllergen.belongsTo(models.allergens, {
      foreignKey: "allergenId",
    });
  };

  return ingredientAllergen;
};
