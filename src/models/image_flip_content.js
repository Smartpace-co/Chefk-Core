"use strict";
module.exports = (sequelize, DataTypes) => {
  const imageFlipContent = sequelize.define(
    "image_flip_contents",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique:true,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "category_id",
        references: {
          model: "categories",
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
          
        },
        field: "created_by",
      },

      updatedBy: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        
        },
        field: "updated_by",
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
  );
  imageFlipContent.associate = function (models) {
   
    imageFlipContent.hasMany(models.images,{foreignKey:"transactionId"})
  };

  return imageFlipContent;
};
