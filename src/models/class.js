"use strict";
module.exports = (sequelize, DataTypes) => {
  const classModel = sequelize.define(
    "classes",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      district_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "district_admins",
          key: "id",
        },
      },
      school_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "schools",
          key: "id",
        },
      },
      // teacher_id: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   references: {
      //     model: "teachers",
      //     key: "id",
      //   },
      // },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "parent_id",
        references: {
          model: "users",
          key: "id",
        },
      },
      grade_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "grades",
          key: "id",
        },
      },
      class_owner_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      number_of_students: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      access_code: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      archived_at: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      deleted_at: {
        allowNull: true,
        type: DataTypes.DATE,
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
  );
  classModel.associate = function (models) {
    // association goes here
    classModel.belongsTo(models.grades, { foreignKey: "grade_id" });
    classModel.hasMany(models.class_standard_subject_groups, { foreignKey: "class_id" });
    classModel.hasMany(models.class_standards, { foreignKey: "class_id" });
    classModel.hasMany(models.class_teachers, { foreignKey: "class_id" });
    classModel.hasMany(models.class_students, { foreignKey: "class_id" });
    classModel.belongsTo(models.schools, { foreignKey: "school_id" });

    //   school.belongsTo(models.user, {foreignKey: 'created_by'});
    //   school.belongsTo(models.user, {foreignKey: 'updated_by'});
  };

  return classModel;
};
