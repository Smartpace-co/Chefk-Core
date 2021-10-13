"use strict";
module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define("comments", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    discussionId: {
      type: DataTypes.INTEGER,
      references: {
        model: "discussion_forums",
        key: "id",
      },
      field: "discussion_id",
    },
    userId: {
      type: DataTypes.INTEGER,
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
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "teachers",
        key: "id",
      },
      field: "teacher_id",
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    commentImage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "comment_image",
    },
    deletedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      field: "deleted_by",
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: "deleted_at",
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      field: "created_by",
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
      field: "deleted_at",
    },

    updatedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      field: "updated_by",
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
  });
  comment.associate = function (models) {
    comment.belongsTo(models.discussion_forums, { foreignKey: "discussionId" });
    comment.belongsTo(models.users, { foreignKey: "userId" });
    comment.belongsTo(models.schools, {
      foreignKey: "schoolId",
    });
    comment.belongsTo(models.district_admins, {
      foreignKey: "districtId",
    });
    comment.belongsTo(models.teachers, {
      foreignKey: "teacherId",
    });
  };

  return comment;
};
