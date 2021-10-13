"use strict";
module.exports = (sequelize, DataTypes) => {
  const additionalNutrient = sequelize.define(
    "additional_nutrients",
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

      nutrientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "nutrient_id",
        references: {
          model: "nutrients",
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
  additionalNutrient.associate = function (models) {
    additionalNutrient.belongsTo(models.ingredients, {
      foreignKey: "ingredientId",
    });
    additionalNutrient.belongsTo(models.nutrients, {
      foreignKey: "nutrientId",
    });
  };

  return additionalNutrient;
};
