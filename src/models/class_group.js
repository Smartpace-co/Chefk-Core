"use strict";
module.exports = (sequelize, DataTypes) => {
    const classGroup = sequelize.define(
        "class_groups",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },

            title: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },

            classId: {
                type: DataTypes.INTEGER,
                field: "class_id",
                references: {
                    model: "classes",
                    key: "class_id",
                },
            },

            groupColorId: {
                type: DataTypes.INTEGER,
                field: "group_color_id",
                references: {
                    model: "group_colors",
                    key: "id",
                },
            },

            status: {
                type: DataTypes.BOOLEAN,
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
                field: "created_at"
            },

            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
                field: "updated_at"
            },
            
            deletedAt: {
                allowNull: true,
                type: DataTypes.DATE,
                field: "deleted_at"
            },
        },
        {
            timestamps: true,
            freezeTableName: true,
            underscored: true,
        }
    );

    classGroup.associate = function (models) {
        classGroup.belongsTo(models.group_colors, {
            foreignKey: "group_color_id",
            as: "groupColor",
        });
        classGroup.hasMany(models.group_students, {
            foreignKey: "class_group_id",
            as: "groupStudents"
        });

    };

    return classGroup;
};
