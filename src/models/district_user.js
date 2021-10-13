"use strict";
module.exports = (sequelize, DataTypes) => {
  const district_admin = sequelize.define(
    "district_users",
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
      district_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "district_admins",
          key: "id",
        },
      },
      first_name: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      
      customerId: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
        field: "customer_id",
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field:"parent_id",
        references: {
          model: "users",
          key: "id",
        },
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
  district_admin.associate = function (models) {
    // association goes here
    district_admin.belongsTo(models.users, { foreignKey: "user_id" });

    //   district_admin.belongsTo(models.package, {foreignKey: 'package_id'});
    //   district_admin.belongsTo(models.user, {foreignKey: 'created_by'});
    //   district_admin.belongsTo(models.user, {foreignKey: 'updated_by'});
  };

  return district_admin;
};
