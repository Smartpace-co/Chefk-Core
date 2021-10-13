"use strict";
module.exports = (sequelize, DataTypes) => {
    const groupColor = sequelize.define(
        "group_colors",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },

            colorName: {
                type: DataTypes.STRING(45),
                allowNull: false,
                unique: true,
                field: "color_name"
            },

            hexCode: {
                type: DataTypes.STRING(45),
                allowNull: false,
                unique: true,
                field: "hex_code"
            },

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



    return groupColor;
};
