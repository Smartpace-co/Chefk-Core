"use strict";
module.exports = (sequelize, DataTypes) => {
  const countryGrade = sequelize.define(
    "country_grades",
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

      gradeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "grade_id",
        references: {
          model: "grades",
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
  countryGrade.associate = function (models) {
    countryGrade.belongsTo(models.countries, {
      foreignKey: "countryId",
    });
    countryGrade.belongsTo(models.grades, {
      foreignKey: "gradeId",

    });
  };

  return countryGrade;
};
