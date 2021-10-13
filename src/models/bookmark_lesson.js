"use strict";
module.exports = (sequelize, DataTypes) => {
    const bookmarkLesson = sequelize.define(
        "bookmark_lessons",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },

            lessonId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: "lesson_id"
            },

            isBookmarked: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                field: "is_bookmarked"
            },

            // deletedAt: {
            //     type: DataTypes.DATE,
            //     field: "deleted_at",
            //     allowNull: false
            // },

            createdBy: {
                type: DataTypes.INTEGER,
                references: {
                    model: "users",
                    key: "id",
                    field: "created_by"
                },
            },

            updatedBy: {
                type: DataTypes.INTEGER,
                references: {
                    model: "users",
                    key: "id",
                    field: "updated_by"
                },
            },

            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
                field: "created_at"
            },

            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
                field: "updated_at"
            },
        },
        {
            timestamps: true,
            freezeTableName: true,
            underscored: true,
        }
    );

    bookmarkLesson.associate = function (models) {
   
        bookmarkLesson.belongsTo(models.lessons, {
          foreignKey: "lesson_id",
        });
        
      };

    return bookmarkLesson;
};
