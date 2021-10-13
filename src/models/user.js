"use strict";
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
      },
      parent_role_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "roles",
          key: "id",
        },
      },
      email: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
      },

      phone_number: {
        type: DataTypes.STRING(45),
        unique: true,
      },

      password: {
        type: DataTypes.STRING(145),
        allowNull: false,
      },

      token: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },

      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_admin",
      },
      
      isSubscriptionPause: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_subscription_pause",
      },

      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      profile_image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      is_email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      is_phone_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
  user.associate = function (models) {
    user.hasOne(models.district_admins, { foreignKey: "user_id" });
    user.hasOne(models.district_users, {
      foreignKey: "user_id",
      as: "details",
    });
    user.hasOne(models.schools, { foreignKey: "user_id" });
    user.hasOne(models.teachers, { foreignKey: "user_id" });
    // user.hasOne(models.user, {foreignKey: 'created_by'});
    // user.hasOne(models.user, {foreignKey: 'updated_by'});
    user.hasOne(models.school_users, {
      foreignKey: "user_id",
      as: "schoolDetails",
    });
    user.hasMany(models.report_issues, { foreignKey: "userId" });
    user.hasMany(models.replies, { foreignKey: "userId" });
    user.hasOne(models.district_admins, { foreignKey: "user_id" });
  };

  return user;
};
