"use strict";

let utils = require("../helpers/utils");

module.exports = (sequelize, DataTypes) => {
  const subscribePackage = sequelize.define(
    "subscribe_packages",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      uuid: {
        type: DataTypes.STRING(45),
        unique: true,
      },

      entityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "entity_id",
        /*references: {
          model: "users",
          key: "id",
        },*/
      },

      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "role_id",
        references: {
          model: "roles",
          key: "id",
        },
      },

      packageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "package_id",
        references: {
          model: "subscription_packages",
          key: "id",
        },
      },

      paymentIntentId: {
        type: DataTypes.STRING(90),
        allowNull: true,
        field: "payment_intent_id",
      },

      sessionId: {
        type: DataTypes.STRING(90),
        allowNull: true,
        field: "session_id",
      },

      subscriptionStartDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "subscription_start_date",
      },

      subscriptionEndDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "subscription_end_date",
      },

      gracePeriodStartDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "grace_period_start_date",
      },

      gracePeriodEndDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "grace_period_end_date",
      },

      subscriptionRenewalDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "subscription_renewal_date",
      },

      isPaymentPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_payment_paid",
      },

      // isOwner: {
      //   type: DataTypes.BOOLEAN,
      //   defaultValue: false,
      //   field: "is_owner",
      // },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "is_active",
      },

      createdBy: {
        type: DataTypes.INTEGER,
        field: "created_by",
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },

      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
  subscribePackage.associate = function (models) {
    subscribePackage.belongsTo(models.subscription_packages, {
      foreignKey: "packageId",
    });
    subscribePackage.hasMany(models.payments, { foreignKey: "subscribeId" });
  };

  //subscribePackage.beforeCreate((e) => (e.uuid = utils.getUUID("SP")));

  return subscribePackage;
};
