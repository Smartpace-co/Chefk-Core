"use strict";
module.exports = (sequelize, DataTypes) => {
  const vote = sequelize.define(
    "votes",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      vote: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
        references: {
          model: "users",
          key: "id",
        },
      },

      discussionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "discussion_id",
        references: {
          model: "discussion_forums",
          key: "id",
        },
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
    },
    {
      timestamps: true,
      freezeTableName: true,
      underscored: true,
    }
  );
  vote.associate = function (models) {
    vote.belongsTo(models.users, { foreignKey: "userId" });
    vote.belongsTo(models.discussion_forums, { foreignKey: "discussionId" });
  };

  return vote;
};
