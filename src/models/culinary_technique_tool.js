"use strict";
module.exports = (sequelize, DataTypes) => {
  const culinaryTechniqueTool = sequelize.define(
    "culinary_technique_tools",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      culinaryTechniqueId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "culinary_technique_id",
        references: {
          model: "culinary_techniques",
          key: "id",
        },
      },

      toolId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "tool_id",
        references: {
          model: "tools",
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
  culinaryTechniqueTool.associate = function (models) {
    culinaryTechniqueTool.belongsTo(models.culinary_techniques, {
      foreignKey: "culinaryTechniqueId",
      as: "toolRequirements",
    });
    culinaryTechniqueTool.belongsTo(models.tools, {
      foreignKey: "toolId",
    });
  };

  return culinaryTechniqueTool;
};
