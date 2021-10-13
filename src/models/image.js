"use strict";
module.exports = (sequelize, DataTypes) => {
  const image = sequelize.define(
    "images",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      image: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      transactionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "transaction_id",
        // references: {
        //   model: "module_master",
        //   key: "id",
        // },
      },

      moduleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "module_id",
        references: {
          model: "module_master",
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
  image.associate = function (models) {
    image.belongsTo(models.module_master, {
      foreignKey: "moduleId",
    });
    image.belongsTo(models.tools, {
      foreignKey: "transactionId",
    });
    image.belongsTo(models.nutrients, {
      foreignKey: "transactionId",
    });
    image.belongsTo(models.ingredients, {
      foreignKey: "transactionId",
    });
    // image.belongsTo(models.countries, {
    //   foreignKey: "countryId",
    // });
    // image.belongsTo(models.items, {
    //   foreignKey: "itemId",
    // });
  };

  return image;
};
