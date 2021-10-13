"use strict";
module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define(
    "roles",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      title: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isMaster: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_master",
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
  role.associate = function (models) {
    // association goes here
    role.hasMany(models.role_modules, { foreignKey: "role_id" });
    //   role.belongsTo(models.user, {foreignKey: 'created_by'});
    //   role.belongsTo(models.user, {foreignKey: 'updated_by'});
  };

  return role;
};
