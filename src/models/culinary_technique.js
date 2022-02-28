"use strict";
module.exports = (sequelize, DataTypes) => {
  const culinaryTechnique = sequelize.define(
    "culinary_techniques",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      culinaryTechniqueTitle: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
        field: "title",
      },

      // safetyLevelId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   field: "safety_level_id",
      //   references: {
      //     model: "safety_levels",
      //     key: "id",
      //   },
      // },

      // languageId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   field: "language_id",
      //   references: {
      //     model: "languages",
      //     key: "id",
      //   },
      // },

      // easyOrdering: {
      //   type: DataTypes.TEXT,
      //   allowNull: false,
      //   field: "easy_ordering",
      // },

      // categoryId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   field: "category_id",
      //   references: {
      //     model: "categories",
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

      // usesId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   field: "uses_id",
      //   references: {
      //     model: "uses",
      //     key: "id",
      //   },
      // },

      // tagId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   field: "tag_id",
      //   references: {
      //     model: "tags",
      //     key: "id",
      //   },
      // },

      kitchenRequirements: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "kitchen_requirements",
      },

      video: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      
      // spotlightVideo: {
      //   type: DataTypes.TEXT,
      //   allowNull: false,
      //   field: "spotlight_video",
      // },

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
  culinaryTechnique.associate = function (models) {
    // culinaryTechnique.belongsTo(models.safety_levels, {
    //   foreignKey: "safetyLevelId",
    //   as: "safetyLevel",
    // });
    // culinaryTechnique.belongsTo(models.languages, {
    //   foreignKey: "languageId",
    // });
    // culinaryTechnique.belongsTo(models.categories, {
    //   foreignKey: "categoryId",
    // });
    // culinaryTechnique.belongsTo(models.types, {
    //   foreignKey: "typeId",
    // });
    // culinaryTechnique.belongsTo(models.tags, {
    //   foreignKey: "tagId",
    // });
    // culinaryTechnique.belongsTo(models.uses, {
    //   foreignKey: "usesId",
    // });
    culinaryTechnique.hasMany(models.culinary_technique_tools, {
      foreignKey: "culinaryTechniqueId",
      as: "toolRequirements",
    });
    culinaryTechnique.hasMany(models.questions, {
      foreignKey: "transaction_id",
      as: "spotlightQuestions",
    });
    culinaryTechnique.hasMany(models.questions, {
      foreignKey: "transaction_id",
      as: "multiSensoryQuestions",
    });
  };

  return culinaryTechnique;
};
