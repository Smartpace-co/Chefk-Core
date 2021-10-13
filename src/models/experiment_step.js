"use strict";
module.exports = (sequelize, DataTypes) => {
  const experimentStep = sequelize.define(
    "experiment_steps",
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
   
      text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      link: {
        type: DataTypes.TEXT,
        allowNull: true,
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
  experimentStep.associate = function (models) {
    experimentStep.belongsTo(models.experiments, {
      foreignKey: "experimentId",
    });
  };

  return experimentStep;
};
