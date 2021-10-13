"use strict";
module.exports = (sequelize, DataTypes) => {
  const item = sequelize.define(
    "items",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      itemTitle: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "item_title",
      },

      stampId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "stamp_id",
        references: {
          model: "stamps",
          key: "id",
        },
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: false,
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
  item.associate = function (models) {
    item.belongsTo(models.stamps, {
      foreignKey: "stampId",
    });
    item.hasMany(models.student_items, {
      foreignKey: "itemId",
    });
  };

  return item;
};
