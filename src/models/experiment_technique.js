"use strict";
module.exports = (sequelize, DataTypes) => {
  const experimentTechnique = sequelize.define(
    "experiment_techniques",
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

      culinaryTechniqueId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "culinary_technique_id",
        references: {
          model: "culinary_techniques",
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
  experimentTechnique.associate = function (models) {
    experimentTechnique.belongsTo(models.experiments, {
      foreignKey: "experimentId",
    });
    experimentTechnique.belongsTo(models.culinary_techniques, {
      foreignKey: "culinaryTechniqueId",
    });
  };

  return experimentTechnique;
};
