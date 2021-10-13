"use strict";
module.exports = (sequelize, DataTypes) => {
  const ingredient = sequelize.define(
    "ingredients",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      ingredientTitle: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
        field: "title",
      },

      easyOrdering: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "easy_ordering",
      },

      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      scientificName: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "scientific_name",
      },

      commonName: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "common_name",
      },

      // languageId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   field: "language_id",
      //   references: {
      //     model: "languages",
      //     key: "id",
      //   },
      // },

      // typeId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   field: "type_id",
      //   references: {
      //     model: "types",
      //     key: "id",
      //   },
      // },

      spotlightVideo: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "spotlight_video",
      },

      seasonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
         field: "season_id",
         references: {
           model: "seasons",
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
  ingredient.associate = function (models) {
    // ingredient.belongsTo(models.languages, {
    //   foreignKey: "languageId",
    // });
    // ingredient.belongsTo(models.types, {
    //   foreignKey: "typeId",
    // });
    // ingredient.belongsTo(models.tags, {
    //   foreignKey: "tagId",
    // });
    // ingredient.belongsTo(models.allergens, {
    //   foreignKey: "allergenId",
    // });
    // ingredient.hasMany(models.science_facts, {
    //   foreignKey: "ingredientId",
    //   as: "scienceFacts",
    // });
    ingredient.hasMany(models.additional_nutrients, {
      foreignKey: "ingredientId",
      as: "additionalNutrients",
    });
    ingredient.hasMany(models.substitutes, {
      foreignKey: "ingredientId",
      as: "substitutes",
    });
    // ingredient.belongsTo(models.substitutes, {
    //   foreignKey: "substituteId",
    // });
    ingredient.hasMany(models.questions, {
      foreignKey: "transaction_id",
      as: "spotlightQuestions",
    });
    ingredient.hasMany(models.questions, {
      foreignKey: "transaction_id",
      as: "multiSensoryQuestions",
    });
    ingredient.hasMany(models.questions, {
      foreignKey: "transaction_id",
      as: "matchThePairQuestions",
    });
    ingredient.hasMany(models.questions, {
      foreignKey: "transaction_id",
      as: "relatedQuestions",
    });
    ingredient.hasMany(models.images, {
      foreignKey: "transaction_id",
    });
    ingredient.hasMany(models.ingredient_tags, {
      foreignKey: "ingredientId",
      as: "tags",
    });
    ingredient.hasMany(models.ingredient_allergens, {
      foreignKey: "ingredientId",
      as: "allergens",
    });
    // ingredient.hasMany(models.image_drag_drops, {
    //   foreignKey: "ingredientId",
    // });
    ingredient.belongsTo(models.seasons, {
      foreignKey: "seasonId",
    });
  };

  return ingredient;
};
