"use strict";
module.exports = (sequelize, DataTypes) => {
  const countryLanguage = sequelize.define(
    "country_languages",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      countryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "country_id",
        references: {
          model: "countries",
          key: "id",
        },
      },

      languageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "language_id",
        references: {
          model: "languages",
          key: "id",
        },
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
  countryLanguage.associate = function (models) {
    countryLanguage.belongsTo(models.countries, {
      foreignKey: "countryId",
    });
    countryLanguage.belongsTo(models.languages, {
      foreignKey: "languageId",
    });
    
  };

  return countryLanguage;
};
