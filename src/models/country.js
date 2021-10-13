"use strict";
module.exports = (sequelize, DataTypes) => {
  const country = sequelize.define(
    "countries",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      countryName: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
        field: "country_name"
      },

      countryTrack: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "country_track",
      },

      backgroundImage: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "background_image",
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
  country.associate = function (models) {
    country.hasMany(models.country_languages, {
      foreignKey: "countryId"
    });
    country.hasMany(models.country_grades, {
      foreignKey: "countryId"
    });
    country.hasMany(models.images, {
      foreignKey: "transaction_id",
    });
  };

  return country;
};
