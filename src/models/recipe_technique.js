"use strict";
module.exports = (sequelize, DataTypes) => {
  const recipeTechnique = sequelize.define(
    "recipe_techniques",
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

      culinaryTechniqueId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "culinary_technique_id",
        references: {
          model: "culinary_techniques",
          key: "id",
        },
      },

      estimatedTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "estimated_time",
      },

      // dialogue: {
      //   type: DataTypes.TEXT,
      //   allowNull: true,
      // },

      // animationLink: {
      //   type: DataTypes.TEXT,
      //   allowNull: true,
      //   field: "animation_link",
      // },

      estimatedTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "estimated_time",
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
  recipeTechnique.associate = function (models) {
    recipeTechnique.belongsTo(models.recipes, {
      foreignKey: "recipeId",
    });
    recipeTechnique.belongsTo(models.culinary_techniques, {
      foreignKey: "culinaryTechniqueId",
      as: "culinaryTechnique",
    });
  };

  return recipeTechnique;
};
