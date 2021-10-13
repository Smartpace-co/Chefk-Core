"use strict";
module.exports = (sequelize, DataTypes) => {
  const question = sequelize.define(
    "questions",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      moduleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "module_id",
        references: {
          model: "module_master",
          key: "id",
        },
      },

      transactionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "transaction_id",
        // references: {
        //   model: "module_master",
        //   key: "id",
        // },
      },

      questionTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "question_type_id",
        references: {
          model: "question_types",
          key: "id",
        },
      },

      answerTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "answer_type_id",
        references: {
          model: "answer_types",
          key: "id",
        },
      },

      hint: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      estimatedTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "estimated_time",
      },
      
      questionTrack: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "question_track",
      },

      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      isDelete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_delete",
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
  question.associate = function (models) {
    question.belongsTo(models.question_types, {
      foreignKey: "questionTypeId",
      as: "questionType"
    });
    question.belongsTo(models.answer_types, {
      foreignKey: "answerTypeId",
    });
    question.belongsTo(models.module_master, {
      foreignKey: "moduleId",
    });
    question.hasMany(models.answers, {
      foreignKey: "questionId",
    });
    question.belongsTo(models.nutrients, {
      foreignKey: "transactionId",
    });
    question.belongsTo(models.ingredients, {
      foreignKey: "transactionId",
    });
    question.belongsTo(models.culinary_techniques, {
      foreignKey: "transactionId",
    });
    question.belongsTo(models.lessons, {
      foreignKey: "transactionId",
    });
    question.hasMany(models.question_standards, {
      foreignKey: "questionId",
      as: "standards",
    });

    question.hasOne(models.question_standards, {
      foreignKey: "questionId",
      as: "questionStandards",
    });

    question.hasOne(models.question_standards, {
      foreignKey: "questionId",
      as: "questionStandard",
    });
  };

  return question;
};
