"use strict";
module.exports = (sequelize, DataTypes) => {
  const teacher = sequelize.define(
    "teachers",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
        references: {
          model: "users",
          key: "id",
        },
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
      custom_district_name: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      first_name: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      contact_person_image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      contact_person_name: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      contact_person_number: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      contact_person_email: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      contact_person_gender: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      emergency_contact_number: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      customerId: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
        field: "customer_id",
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field:"parent_id",
        references: {
          model: "users",
          key: "id",
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
  teacher.associate = function (models) {
    // association goes here
    teacher.belongsTo(models.users, { foreignKey: "user_id" });
    teacher.belongsTo(models.schools, { foreignKey: "school_id" });
    teacher.hasMany(models.class_teachers, { foreignKey: "teacher_id" });
    teacher.hasMany(models.discussion_forums, {
      foreignKey: "teacherId"
    });

    teacher.hasMany(models.comments, {
      foreignKey: "teacherId"
    });
    teacher.hasMany(models.replies, {
      foreignKey: "teacherId"
    });

    //   school.belongsTo(models.user, {foreignKey: 'created_by'});
    //   school.belongsTo(models.user, {foreignKey: 'updated_by'});
  };

  return teacher;
};
