"use strict";
module.exports = (sequelize, DataTypes) => {
  const reportIssue = sequelize.define(
    "report_issues",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        field: "user_id",
      },
      schoolId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "schools",
          key: "id",
        },
        field: "school_id",
      },
      districtId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "district_admins",
          key: "id",
        },
        field: "district_id",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      attachment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING(20),
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

  reportIssue.associate = function (models) {
    reportIssue.belongsTo(models.users, { foreignKey: "userId" });
    reportIssue.hasMany(models.issues_feedbacks, {
      foreignKey: "reportIssueId",
    });
    reportIssue.belongsTo(models.schools, {
      foreignKey: "schoolId",
    });
    reportIssue.belongsTo(models.district_admins, {
      foreignKey: "districtId",
    });
  };
  return reportIssue;
};
