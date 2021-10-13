"use strict";
module.exports = (sequelize, DataTypes) => {
  const substitute = sequelize.define(
    "substitutes",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      ingredientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "ingredient_id",
        references: {
          model: "ingredients",
          key: "id",
        },
      },

      substituteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "substitute_id",
        references: {
          model: "ingredients",
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
  substitute.associate = function (models) {
    substitute.belongsTo(models.ingredients, {
      foreignKey: "ingredientId",
      as: "substitutes",
    });
    substitute.belongsTo(models.ingredients, {
      foreignKey: "substituteId",
    });
  };

  return substitute;
};
