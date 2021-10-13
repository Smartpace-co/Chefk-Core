"use strict"

module.exports = (sequelize, DataTypes) => {

    const issuesFeedback = sequelize.define("issues_feedbacks", {


        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },

       reportIssueId: {
            type: DataTypes.INTEGER,
            field: "report_issue_id",
            allowNull: false,
            references: {
                model: "report_issues",
                key: "id"
            }
        },

        comment: {
            type: DataTypes.TEXT,
            allowNull: true,

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
    )

    issuesFeedback.associate = function (models) {
       issuesFeedback.belongsTo(models.report_issues,{foreignKey:"reportIssueId"})
    }
    return issuesFeedback

}