let User = require("../models").users;
let Lesson = require("../models").lessons;
let Class = require("../models").classes;
const AssignLesson = require("../models").assign_lessons;
const TeacherInstruction = require("../models").teacher_instructions;
let Grade = require("../models").grades;
const Image = require("../models").images;
const ModuleMaster = require("../models").module_master;
const Recipe = require("../models").recipes;
const Country = require("../models").countries;
const RecipeIngredient = require("../models").recipe_ingredients;
const Ingredient = require("../models").ingredients;
const LessonSetting = require("../models").lesson_settings;
const BookmarkLesson = require("../models").bookmark_lessons;
const StudentLessonProgress = require("../models").student_lesson_progress;
const UnitOfMeasurements = require("../models").unit_of_measurements;
const Substitue = require("../models").substitutes;

// const DifficultyLevel = require("../models").difficulty_level;

let utils = require("../helpers/utils");

let modelHelper = require("../helpers/modelHelper");
let { sequelize } = require("../models/index");
let { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = {
  getAllAssignments: async (req, user_id) => {
    try {
      //filter
      const filter = {};
      req.query.classId ? (filter.classId = req.query.classId) : null;
      filter.deletedAt = null;

      //order by
      const order = [];
      const orderItem = ["id"];
      orderItem.push("DESC");
      order.push(orderItem);
      //serach
      const searchBy = {};
      //pagging
      const { page_size, page_no = 1 } = req.query;
      const pagging = {};
      parseInt(page_size)
        ? (pagging.offset = parseInt(page_size) * (page_no - 1))
        : null;
      parseInt(page_size) ? (pagging.limit = parseInt(page_size)) : null;

      const rows = await AssignLesson.findAll({
        where: {
          ...filter,
          // startDate: { [Op.between]: filterDate }
        },
        include: [
          {
            model: Lesson,
            attributes: [
              "id",
              "lessonTitle",
              "learningObjectivesForTeacher",
              "learningObjectivesForStudent",
              "isFeatured",
              "storyTime",
              "status",
            ],
            where: { status: true, isDeleted: false },
            required: true,
            include: [
              {
                model: TeacherInstruction,
                as: "teacherInstructions",
              },
              {
                model: Grade,
                attributes: ["id", "grade"],
              },
              // {
              //   model: BookmarkLesson,
              //   as: "bookmarkLesson",
              //   attributes: ["lessonId", "isBookmarked"]
              // }
            ],
          },
          {
            model: LessonSetting,
            attributes: ["id", "settingName", "content"],
            as: "customSetting",
          },
          {
            model: Recipe,
            attributes: [
              "id",
              "recipeTitle",
              "recipeImage",
              "alternativeName",
              "estimatedMakeTime",
              "estimatedTimeForPreparation",
              "countryId",
            ],
            required: true,
            include: [
              {
                model: Country,
                attributes: ["id", "countryName"],
              },
              {
                model: RecipeIngredient,
                as: "recipeIngredients",
                attributes: ["id", "ingredientId"],
                include: [
                  {
                    model: Ingredient,
                    attributes: ["id", "ingredientTitle"],
                  },
                ],
              },
            ],
          },
        ],
        order,
        // ...pagging,
      });

      // calculating lesson time
      const data=[];
      for (row of rows) {
        row = row.toJSON();
        let lessonTime = 0;
        //recipe time
        lessonTime += row.recipe.estimatedMakeTime ? row.recipe.estimatedMakeTime : 0;
        //preperation time
        lessonTime += row.recipe.estimatedTimeForPreparation ? row.recipe.estimatedTimeForPreparation : 0;
        if (row.customSetting) {
          const customSetting = row.customSetting.content;
          //cooking time
          if (customSetting[0].status) lessonTime += customSetting[0].time ? customSetting[0].time : 0;
          //technique time
          for ( item of customSetting[0].cooking) if (item.status) lessonTime += item.estimatedTime ? item.estimatedTime : 0;
          //story time
          if (customSetting[1].status) lessonTime += customSetting[1].time ? customSetting[1].time : 0;
          //sensory and experiment time
          if (customSetting[2].status) lessonTime += customSetting[2].time ? customSetting[2].time : 0;
          //assessment time
          if (customSetting[3].status) lessonTime += customSetting[3].time ? customSetting[3].time : 0;
        }
        row.lessonTime = lessonTime;
        data.push(row);
      }
        // recipetime+ settingsvales+ preperationtime
      //

      // Add bookmark key
      // rows.map(obj => {
      //   return obj.dataValues.lesson.setDataValue('bookmarkLesson', obj.lesson.bookmarkLesson.length ? obj.lesson.bookmarkLesson.map(newObj => newObj.isBookmarked)[0] : false);
      // }
      // );
      return utils.responseGenerator(
        StatusCodes.OK,
        "Assigned lessons fetched",
        { rows : data }
      );
    } catch (err) {
      throw err;
    }
  },

  archiveAssignment: async (param_id, user_id) => {
    try {
      const assignmentDetails = await AssignLesson.findOne({
        where: { id: param_id, deleted_at: null },
      });
      if (!assignmentDetails) {
        return utils.responseGenerator(
          StatusCodes.BAD_REQUEST,
          "Assignment does not exist"
        );
      }
      const body = { archivedAt: new Date(), updatedBy: user_id };
      const result = await AssignLesson.update(body, {
        where: {
          id: param_id,
        },
      });
      return utils.responseGenerator(
        StatusCodes.OK,
        "Assignment archieved successfully",
        {
          result,
        }
      );
    } catch (err) {
      throw err;
    }
  },

  unArchiveAssignment: async (param_id, user_id) => {
    try {
      const assignmentDetails = await AssignLesson.findOne({
        where: { id: param_id, deleted_at: null },
      });
      if (!assignmentDetails) {
        return utils.responseGenerator(
          StatusCodes.BAD_REQUEST,
          "Assignment does not exist"
        );
      }
      const body = { archivedAt: null, updatedBy: user_id };
      const result = await AssignLesson.update(body, {
        where: {
          id: param_id,
        },
      });
      return utils.responseGenerator(
        StatusCodes.OK,
        "Assignment unarchieved successfully",
        {
          result,
        }
      );
    } catch (err) {
      throw err;
    }
  },

  getTeacherInstruction: async (param_id, user_id) => {
    try {
      //accessibleIds of this user
      // const ids = await modelHelper.accessibleIds(user_id);
      const instructionData = await TeacherInstruction.findAll({
        attributes: ["id", "lessonId", "text", "createdAt", "updatedBy"],
        where: { lessonId: param_id },
      });
      if (!instructionData)
        return utils.responseGenerator(
          StatusCodes.BAD_REQUEST,
          "Instructions not exist"
        );

      return utils.responseGenerator(
        StatusCodes.OK,
        "Teacher instruction fetched successfully",
        {
          instructionData,
        }
      );
    } catch (err) {
      throw err;
    }
  },

  getRecipeIngredients: async (param_id, user_id) => {
    try {

      let data = await AssignLesson.findOne({
        attributes: ["id", "assignmentTitle", "lessonId", "recipeId"],
        where: {
          id: param_id,
        },
        include: [
          {
            model: Recipe,
            attributes: [
              "id",
              "recipeTitle",
              // "recipeImage",
            ],
            include: [
              {
                model: RecipeIngredient,
                as: "recipeIngredients",
                attributes: ["id", "ingredientId", "unitOfMeasurementId", "quantity", "status"],
                include: [
                  {
                    model: UnitOfMeasurements,
                    attributes: ["id", "title"],
                    as: "unitOfMeasurement"
                  },
                  {
                    model: Ingredient,
                    attributes: ["id", "ingredientTitle", "size"],
                    include: [
                      {
                        model: Image,
                        attributes: ["id", "image", "transactionId", "moduleId"],
                        include: [
                          {
                            model: ModuleMaster,
                            attributes: ["id", "moduleKey"],
                            where: { moduleKey: "ingredients" }
                          }
                        ]
                      },
                      {
                        model: Substitue,
                        attributes: ["id", "ingredientId", "substituteId"],
                        as: "substitutes",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        // order,
        // ...pagging,
      });

      if (!data)
        return utils.responseGenerator(
          StatusCodes.BAD_REQUEST,
          "Recipe Ingredients not exist"
        );

      data = JSON.parse(JSON.stringify(data));
      data.recipe.recipeIngredients = data.recipe.recipeIngredients.map(obj => {
        obj.image = obj.ingredient.images.length ? obj.ingredient.images[0].image : null;
        obj.substituteId = obj.ingredient.substitutes.length ? obj.ingredient.substitutes[0].substituteId : null;
        obj.ingredientTitle = obj.ingredient ? obj.ingredient.ingredientTitle : '';
        obj.mesurementUnit = obj.unitOfMeasurement ? obj.unitOfMeasurement.title : '';
        obj.substituteList = obj.ingredient.substitutes.length ? true : false;
        delete obj.unitOfMeasurement;
        delete obj.ingredient;
        return obj;
      })

      return utils.responseGenerator(StatusCodes.OK, "Ingredients list fetched successfully", data);
    } catch (err) {
      throw err;
    }
  },

  getSubstitueList: async (param_id, user_id) => {
    try {
      let data = await RecipeIngredient.findOne({
        attributes: ["id", "ingredientId", "unitOfMeasurementId", "quantity", "status"],
        where: { ingredientId: param_id },
        include: [
          {
            model: UnitOfMeasurements,
            attributes: ["id", "title"],
            as: "unitOfMeasurement"
          },
          {
            model: Ingredient,
            attributes: ["id", "ingredientTitle", "size"],
            include: [
              {
                model: Image,
                attributes: ["id", "image", "transactionId", "moduleId"],
                include: [
                  {
                    model: ModuleMaster,
                    attributes: ["id", "moduleKey"],
                    where: { moduleKey: "ingredients" }
                  }
                ]
              },
            ],
          },
        ],
        // order,
        // ...pagging,
      });

      if (!data)
        return utils.responseGenerator(
          StatusCodes.BAD_REQUEST,
          "Recipe Ingredients not exist"
        );
      data = JSON.parse(JSON.stringify(data));
      data.image = data.ingredient.images.length ? data.ingredient.images[0].image : null;
      data.ingredientTitle = data.ingredient ? data.ingredient.ingredientTitle : '';
      data.mesurementUnit = data.unitOfMeasurement ? data.unitOfMeasurement.title : '';
      delete data.unitOfMeasurement;
      delete data.ingredient;

      return utils.responseGenerator(StatusCodes.OK, "Substitute ingredient fetched successfully", data);
    } catch (err) {
      throw err;
    }
  },

  updateAssignment: async (reqBody, param_id, user_id) => {
    try {
      //filter

      const ids = await modelHelper.accessibleIds(user_id);
      const lessonDetail = await AssignLesson.findOne({
        where: { id: param_id, createdBy: [user_id, ...ids] },
      });
      if (!lessonDetail) {
        return utils.responseGenerator(
          StatusCodes.BAD_REQUEST,
          "Assignment does not exist"
        );
      }
      if (reqBody.classId) {
        const count = await Class.count({ where: { id: reqBody.classId } });
        if (!count) {
          return utils.responseGenerator(
            StatusCodes.BAD_REQUEST,
            "Class do not exist"
          );
        }
      }

      const progressCount = await StudentLessonProgress.count({
        where: { assignLessonId: param_id },
      });
      if (progressCount) {
        return utils.responseGenerator(
          StatusCodes.BAD_REQUEST,
          "Edit not allowed now"
        );
      }

      const result = await AssignLesson.update(reqBody, {
        where: { id: param_id, deletedAt: null },
      });

      if (result[0] !== 0 && reqBody.customSettingId) {
        await LessonSetting.update(reqBody, {
          where: { id: reqBody.customSettingId, createdBy: [user_id, ...ids] },
        });
      }

      return utils.responseGenerator(
        StatusCodes.OK,
        "Assignment updated",
        result
      );
    } catch (err) {
      throw err;
    }
  },

  deleteAssignment: async (param_id, user_id) => {
    try {
      //accessibleIds of this user
      const ids = await modelHelper.accessibleIds(user_id);
      const assignDetails = await AssignLesson.findOne({
        where: {
          id: param_id,
          createdBy: [user_id, ...ids],
          deleted_at: null,
        },
      });

      if (!assignDetails) {
        return utils.responseGenerator(
          StatusCodes.BAD_REQUEST,
          "Assignment not exist"
        );
      }

      const progressCount = await StudentLessonProgress.count({
        where: { assignLessonId: param_id },
      });
      if (progressCount) {
        return utils.responseGenerator(
          StatusCodes.BAD_REQUEST,
          "Delete not allowed now"
        );
      }
      const body = { deletedAt: new Date(), updatedBy: user_id };
      const result = await AssignLesson.update(body, {
        where: {
          id: param_id,
        },
      });
      return utils.responseGenerator(
        StatusCodes.OK,
        "Assignment deleted successfully",
        {
          result,
        }
      );
    } catch (err) {
      throw err;
    }
  },
};
