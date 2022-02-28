"use strict";
module.exports = (sequelize, DataTypes) => {
  const recipe = sequelize.define(
    "recipes",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      recipeTitle: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: "title",
      },

      holiday: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      alternativeName: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "alternative_names",
      },

      estimatedMakeTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "estimated_make_time",
      },

      recipeImage: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "image",
      },

      serves: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      countryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "country_id",
        references: {
          model: "countries",
          key: "id",
        },
      },

      lessonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "lesson_id",
        references: {
          model: "lessons",
          key: "id",
        },
      },

      recipeImage: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "image",
      },
      
      preparationStepsTrack: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "preparation_steps_track",
      },

      cookingStepsTrack: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "cooking_steps_track",
      },

      servingStepsTrack: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "serving_steps_track",
      },

      isChefInHouse: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_chef_in_house",
      },

      isChefAmbassador: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_chef_ambassador",
      },
      
      estimatedTimeForCooking: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "estimated_time_for_cooking",
      },

      estimatedTimeForPreparation: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "estimated_time_for_preparation",
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
  recipe.associate = function (models) {
    recipe.belongsTo(models.lessons, {
      foreignKey: "lessonId",
    });
    recipe.belongsTo(models.countries, {
      foreignKey: "countryId",
    });
    recipe.hasMany(models.big_chef_tools, {
      foreignKey: "recipeId",
      as: "bigChefTools",
    });
    recipe.hasMany(models.little_chef_tools, {
      foreignKey: "recipeId",
      as: "littleChefTools",
    });
    recipe.hasMany(models.recipe_ingredients, {
      foreignKey: "recipeId",
      as: "recipeIngredients",
    });
    recipe.hasMany(models.recipe_techniques, {
      foreignKey: "recipeId",
      as: "recipeTechniques",
    });
    recipe.hasMany(models.preparation_steps, {
      foreignKey: "recipeId",
      as: "preparationSteps",
    });
    recipe.hasMany(models.cooking_steps, {
      foreignKey: "recipeId",
      as: "cookingSteps",
    });
    recipe.hasMany(models.serving_steps, {
      foreignKey: "recipeId",
      as: "servingSteps",
    });
    recipe.hasMany(models.assign_lessons, {
      foreignKey: "recipeId",
    });
  };

  return recipe;
};
