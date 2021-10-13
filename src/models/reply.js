"use strict";
module.exports = (sequelize, DataTypes) => {
  const reply = sequelize.define(
    "replies",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      commentId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
          model:"comments",
          key:"id"
        },
        field:"comment_id"
      },
      userId:{
        type: DataTypes.INTEGER,
        allowNull:false,
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
      reply: {
        type: DataTypes.TEXT,
        allowNull: false,
        
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      deletedBy: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",

        },
        field: "deleted_by",
        allowNull: true

        },
      deletedAt:{
        type: DataTypes.DATE,
        field: "deleted_at",
        allowNull: true

      },
      createdBy: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",

        },
        field: "created_by",
      },
      deletedAt:{
        allowNull: false,
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
    },
  );
  reply.associate = function (models) {

    reply.belongsTo(models.comments,{foreignKey:"commentId"})
    reply.belongsTo(models.users,{foreignKey:"userId"})
    reply.belongsTo(models.schools, {
      foreignKey: "schoolId"
      });
      reply.belongsTo(models.district_admins, {
        foreignKey: "districtId",
      });
      reply.belongsTo(models.teachers, {
        foreignKey: "teacherId",
      });
  };

  return reply;
};
