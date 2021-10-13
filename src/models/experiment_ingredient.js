"use strict";
module.exports = (sequelize, DataTypes) => {
  const experimentIngredient = sequelize.define(
    "experiment_ingredients",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      experimentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "experiment_id",
        references: {
          model: "experiments",
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
  experimentIngredient.associate = function (models) {
    experimentIngredient.belongsTo(models.experiments, {
      foreignKey: "experimentId",
    });
    experimentIngredient.belongsTo(models.ingredients, {
      foreignKey: "ingredientId",
    });
  };

  return experimentIngredient;
};
