"use strict";
module.exports = (sequelize, DataTypes) => {
  const preparationStep = sequelize.define(
    "preparation_steps",
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

      text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      link: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      // estimatedTime: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   field: "estimated_time",
      // },

      isApplicableForBigChef: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_applicable_for_big_chef",
      },

      isApplicableForLittleChef: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_applicable_for_little_chef",
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
  preparationStep.associate = function (models) {
    preparationStep.belongsTo(models.recipes, {
      foreignKey: "recipeId",
    });
  };

  return preparationStep;
};
