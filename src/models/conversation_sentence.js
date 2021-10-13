"use strict"

module.exports = (sequelize, DataTypes) => {
    const conversationSentence = sequelize.define(
        "conversation_sentences",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },

            conversationSentence: {
                type: DataTypes.TEXT,
                allowNull: false,
                unique: true,
                field: "conversation_sentence",
            },

            categoryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: "category_id",
                references: {
                    model: "categories",
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
                    field: "created_by",
                },
            },

            updatedBy: {
                type: DataTypes.INTEGER,
                references: {
                    model: "users",
                    key: "id",
                    field: "updated_by",
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

    conversationSentence.associate = function (models) {
        conversationSentence.belongsTo(models.categories, {
            foreignKey: "categoryId",
        });
    };

    return conversationSentence;
};
