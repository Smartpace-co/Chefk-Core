"use strict";
module.exports = (sequelize, DataTypes) => {
  const system_language = sequelize.define(
    "system_languages",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
      },
      key: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        field: "created_by",
        references: {
          model: "users",
          key: "id",
        },
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        field: "updated_by",
        references: {
          model: "users",
          key: "id",
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
  system_language.associate = function (models) {
    system_language.hasOne(models.subjects, {
      foreignKey: "systemLanguageId",
      as: "subjects",
    });
    system_language.hasOne(models.standards, {
      foreignKey: "systemLanguageId",
      as: "standards",
    });
    system_language.hasOne(models.ingredients, {
      foreignKey: "systemLanguageId",
      as: "ingredients",
    });
    system_language.hasOne(models.nutrients, {
      foreignKey: "systemLanguageId",
      as: "nutrients",
    });
    system_language.hasOne(models.stamps, {
      foreignKey: "systemLanguageId",
      as: "stamps",
    });
    system_language.hasOne(models.countries, {
      foreignKey: "systemLanguageId",
      as: "countries",
    });
    system_language.hasOne(models.unit_of_measurements, {
      foreignKey: "systemLanguageId",
      as: "unit_of_measurements",
    });
    system_language.hasOne(models.lessons, {
      foreignKey: "systemLanguageId",
      as: "lessons",
    });
    system_language.hasOne(models.culinary_techniques, {
      foreignKey: "systemLanguageId",
      as: "culinary_techniques",
    });
    system_language.hasOne(models.tools, {
      foreignKey: "systemLanguageId",
      as: "tools",
    });
  };

  return system_language;
};
