"use strict";
module.exports = (sequelize, DataTypes) => {
  const lessonSetting = sequelize.define(
    "lesson_settings",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          settingName: {
            type: DataTypes.STRING(45),
            field: "setting_name",
            allowNull: true,
          },
          content: {
            type: DataTypes.JSON,
            allowNull: false,
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

  lessonSetting.associate = function (models) {
    lessonSetting.hasOne(models.assign_lessons, {
      foreignKey: "customSettingId",
    });
  };

  return lessonSetting;
};
