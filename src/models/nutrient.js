"use strict";
module.exports = (sequelize, DataTypes) => {
  const nutrient = sequelize.define(
    "nutrients",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      nutrientTitle: {
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

      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "category_id",
        references: {
          model: "categories",
          key: "id",
        },
      },

      typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "type_id",
        references: {
          model: "types",
          key: "id",
        },
      },

      // usesId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   field: "uses_id",
      //   references: {
      //     model: "uses",
      //     key: "id",
      //   },
      // },

      // originId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   field: "origin_id",
      //   references: {
      //     model: "origins",
      //     key: "id",
      //   },
      // },

      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      spotlightVideo: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "spotlight_video",
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
  nutrient.associate = function (models) {
    // nutrient.belongsTo(models.safety_levels, {
    //   foreignKey: "safetyLevelId",
    //   as: "safetyLevel",
    // });
    nutrient.belongsTo(models.categories, {
      foreignKey: "categoryId",
    });
    nutrient.belongsTo(models.types, {
      foreignKey: "typeId",
    });
    // nutrient.belongsTo(models.origins, {
    //   foreignKey: "originId",
    // });
    // nutrient.belongsTo(models.uses, {
    //   foreignKey: "usesId",
    // });
    nutrient.hasMany(models.questions, {
      foreignKey: "transaction_id",
      as: "spotlightQuestions",
    });
    // nutrient.hasMany(models.questions, {
    //   foreignKey: "transaction_id",
    //   as: "multiSensoryQuestions",
    // });
    nutrient.hasMany(models.questions, {
      foreignKey: "transaction_id",
      as: "relatedQuestions",
    });
    nutrient.hasMany(models.images, {
      foreignKey: "transaction_id",
    });
  };

  return nutrient;
};
