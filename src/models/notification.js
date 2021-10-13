"use strict";
module.exports = (sequelize, DataTypes) => {
  const notification = sequelize.define(
    "notifications",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      entityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "entity_id",
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

      notificationTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "notification_type_id",
        references: {
          model: "notification_types",
          key: "id",
        },
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      isSeen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_seen",
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
  notification.associate = function (models) {
    notification.belongsTo(models.notification_types, {
      foreignKey: "notificationTypeId",
      as:"notificationType"
    });
  };

  return notification;
};
