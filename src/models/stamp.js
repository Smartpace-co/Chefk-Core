"use strict";
module.exports = (sequelize, DataTypes) => {
  const stamp = sequelize.define(
    "stamps",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      stampTitle: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: "stamp_title",
      },

      stampType: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: "stamp_type",
      },
      countryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "country_id",
        references: {
          model: "countries",
          key: "id",
        },
      },
      levelTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "level_type_id",
        references: {
          model: "level_types",
          key: "id",
        },
      },

      learningTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "learning_type_id",
        references: {
          model: "learning_types",
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
  stamp.associate = function (models) {
    stamp.belongsTo(models.countries, {
      foreignKey: "countryId",
    });
    stamp.belongsTo(models.level_types, {
      foreignKey: "levelTypeId",
    });
    stamp.belongsTo(models.learning_types, {
      foreignKey: "learningTypeId",
    });
    stamp.hasMany(models.images, {
      foreignKey: "transaction_id",
    });
    stamp.hasMany(models.student_stamps, {
      foreignKey: "stampId",
    });
    stamp.hasMany(models.items, {
      foreignKey: "stampId",
    });
  };

  return stamp;
};
