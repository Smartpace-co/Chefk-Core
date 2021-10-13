"use strict";
module.exports = (sequelize, DataTypes) => {
  const payment = sequelize.define(
    "payments",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      subscribeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "subscribe_id",
        references: {
          model: "subscribe_packages",
          key: "id",
        },
      },

      isPaymentPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "is_payment_paid",
      },

      sessionId: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
        field: "session_id",
      },

      paymentIntentId: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
        field: "payment_intent_id",
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
  payment.associate = function (models) {
    payment.hasMany(models.role_modules, { foreignKey: "module_id" });
  };

  return payment;
};
