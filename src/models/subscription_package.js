"use strict";
module.exports = (sequelize, DataTypes) => {
  const subscriptionPackage = sequelize.define(
    "subscription_packages",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      packageTitle: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
        field: "title",
      },

      packageFor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "package_for",
        references: {
          model: "roles",
          key: "id",
        },
      },

      maxUser: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "max_user",
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      gracePeriod: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "grace_period",
      },

      isPrivate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_private",
      },

      validityFrom: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "validity_from",
      },

      validityTo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "validity_to",
      },

      shareableLink: {
        type: DataTypes.STRING(256),
        allowNull: true,
        field: "shareable_link",
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      productId: {
        type: DataTypes.STRING(90),
        allowNull: false,
        field: "product_id",
      },


      priceId: {
        type: DataTypes.STRING(90),
        allowNull: false,
        field: "price_id",
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
  subscriptionPackage.associate = function (models) {
    // subscriptionPackage.hasMany(models.subscription_package_lessons, {
    //   foreignKey: "packageId",
    //   as: "lessons",
    // });
    // subscriptionPackage.hasOne(models.subscription_package_plans, {
    //   foreignKey: "packageId",
    // });
  };

  return subscriptionPackage;
};
