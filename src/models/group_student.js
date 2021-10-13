"use strict";
module.exports = (sequelize, DataTypes) => {
    const groupStudents = sequelize.define(
        "group_students",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },

            classId: {
                type: DataTypes.INTEGER,
                field: "class_id",
                references: {
                    model: "classes",
                    key: "class_id",
                },
            },

            classGroupId: {
                type: DataTypes.INTEGER,
                field: "class_group_id",
                references: {
                  model: "class_groups",
                  key: "id",
                },
              },
        
              studentId: {
                type: DataTypes.INTEGER,
                field: "student_id",
                references: {
                  model: "students",
                  key: "id",
                  field: "student_id"
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


    groupStudents.associate = function (models) {
        groupStudents.belongsTo(models.students, { foreignKey: "student_id" });
        groupStudents.belongsTo(models.class_groups, { foreignKey: "class_group_id", as: "classGroup" });


        // classGroup.belongsTo(models.group_students, { foreignKey: "groupColorId" });
    
        };
    return groupStudents;
};
