"use strict";
module.exports = (sequelize, DataTypes) => {
  const experimentTool = sequelize.define(
    "experiment_tools",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      experimentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "experiment_id",
        references: {
          model: "experiments",
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
  experimentTool.associate = function (models) {
    experimentTool.belongsTo(models.experiments, {
      foreignKey: "experimentId",
    });
    experimentTool.belongsTo(models.tools, {
      foreignKey: "toolId",
    });
  };

  return experimentTool;
};
