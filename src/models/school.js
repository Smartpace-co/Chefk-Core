"use strict";
module.exports = (sequelize, DataTypes) => {
  const school = sequelize.define(
    "schools",
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
      customDistrictName: {
        type: DataTypes.STRING(45),
        field: "custom_district_name",
        allowNull: true,
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "parent_id",
        references: {
          model: "users",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      display_name: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      admin_account_name: {
        type: DataTypes.STRING(45),
        unique: false,
      },
      admin_address: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      admin_gender: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      school_address: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      school_image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      school_phone_no: {
        type: DataTypes.STRING(45),
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
      contact_person_title: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      contact_person_address: {
        type: DataTypes.STRING(250),
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
      max_user: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },

      customerId: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
        field: "customer_id",
      },
      // status: {
      //   type: DataTypes.BOOLEAN,
      //   defaultValue: true,
      // },
      deletedBy: {
        type: DataTypes.INTEGER,
        field: "deleted_by",
        references: {
          model: "users",
          key: "id",
        },
        allowNull: true,
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: "deleted_at",
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
  school.associate = function (models) {
    school.belongsTo(models.users, { foreignKey: "user_id" });
    school.belongsTo(models.district_admins, { foreignKey: "district_id" });

    school.hasMany(models.report_issues, {
      foreignKey: "schoolId",
    });
    school.hasMany(models.discussion_forums, {
      foreignKey: "schoolId",
    });
    school.hasMany(models.comments, {
      foreignKey: "schoolId",
    });
    school.hasMany(models.replies, {
      foreignKey: "schoolId",
    });
    school.hasMany(models.classes, { foreignKey: "school_id" });

    school.hasMany(models.teachers, { foreignKey: "school_id" });
    school.hasMany(models.students, { foreignKey: "school_id" });

    // user.hasOne(models.user, {foreignKey: 'created_by'});
    // user.hasOne(models.user, {foreignKey: 'updated_by'});
  };

  return school;
};
