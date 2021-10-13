"use strict";
module.exports = (sequelize, DataTypes) => {
  const district_admin = sequelize.define(
    "district_admins",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
        references: {
          model: "users",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      display_name: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      admin_account_name: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      admin_address: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      admin_gender: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      district_address: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      district_image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      district_phone_no: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      contact_person_image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      contact_person_name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      contact_person_no: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      contact_person_email: {
        type: DataTypes.STRING(45),
        defaultValue: true,
      },
      contact_person_gender: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      contact_person_title: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
    
      customerId: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
        field: "customer_id",
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
      deletedBy: {
        type: DataTypes.INTEGER,
        field: "deleted_by",
        allowNull: true,
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
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: "deleted_at",
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      underscored: true,
    }
  );
  district_admin.associate = function (models) {
    // association goes here
    district_admin.belongsTo(models.users, { foreignKey: "user_id" });
    district_admin.hasMany(models.report_issues, {
      foreignKey: "districtId"
    });
    district_admin.hasMany(models.discussion_forums, {
      foreignKey: "districtId"
    });

    district_admin.hasMany(models.comments, {
      foreignKey: "districtId"
    });
    district_admin.hasMany(models.replies, {
      foreignKey: "districtId"
    });
    //   district_admin.belongsTo(models.package, {foreignKey: 'package_id'});
    //   district_admin.belongsTo(models.user, {foreignKey: 'created_by'});
    //   district_admin.belongsTo(models.user, {foreignKey: 'updated_by'});
  };

  return district_admin;
};
