"use strict";
module.exports = (sequelize, DataTypes) => {
  const discussionForum = sequelize.define("discussion_forums", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
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
    topic: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    upVote: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "up_vote",
      allowNull: true,
    },
    downVote: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "down_vote",
      allowNull: true,
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_pinned",
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
      allowNull: true,
      type: DataTypes.DATE,
      field: "deleted_at",
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
      },
      field: "created_by",
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
  discussionForum.associate = function (models) {
    discussionForum.hasMany(models.comments, { foreignKey: "discussionId" });
    discussionForum.belongsTo(models.users, { foreignKey: "userId" });
    discussionForum.belongsTo(models.schools, {
      foreignKey: "schoolId",
    });
    discussionForum.belongsTo(models.district_admins, {
      foreignKey: "districtId",
    });
    discussionForum.belongsTo(models.teachers, {
      foreignKey: "teacherId",
    });
    discussionForum.hasMany(models.votes, { foreignKey: "discussionId" });
  };

  return discussionForum;
};
