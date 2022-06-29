let User = require("../models").users;
const Role = require("../models/").roles;
let Lesson = require("../models").lessons;
let Class = require("../models").classes;
let Grade = require("../models").grades;
let Activity = require("../models").activities;
const Country = require("../models").countries;
const Experiment = require("../models").experiments;
const Recipe = require("../models").recipes;
const QuestionType = require("../models").question_types;
// const ModuleMaster = require("../models").module_master;
const Question = require("../models").questions;
const QuestionStandard = require("../models").question_standards;
const Standard = require("../models").standards;
const RecipeIngredient = require("../models").recipe_ingredients;
const RecipeTechnique = require("../models").recipe_techniques;
const CookingStep = require("../models").cooking_steps;
const ExperimentTool = require("../models").experiment_tools;
const Ingredient = require("../models").ingredients;
const CulinaryTechnique = require("../models").culinary_techniques;
const Language = require("../models").languages;
const Tool = require("../models").tools;
const AdditionalNutrient = require("../models").additional_nutrients;
const LessonSetting = require("../models").lesson_settings;
const AssignLesson = require("../models").assign_lessons;
const BookmarkLesson = require("../models").bookmark_lessons;
let notificationService = require("../service/notificationService");
const StudentLessonRating = require("../models").student_lesson_ratings;
// const DifficultyLevel = require("../models").difficulty_level;
let ClassStudent = require("../models").class_students;
let ModuleMaster = require("../models").module_master;
let Image = require("../models").images;
let ConversationSentence = require("../models").conversation_sentences;
let utils = require("../helpers/utils");

let modelHelper = require("../helpers/modelHelper");
let { sequelize } = require("../models/index");
let { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

//////////////////////////////// FUNCTIONS

async function getAssignment(filter) {
  try {
    const data = await AssignLesson.findOne({
      where: filter,
      include: "customSetting",
    });
    return data ? data.toJSON() : undefined;
  } catch (err) {
    throw err;
  }
}
async function getRecipe(filter) {
  try {
    const moduleId = (
      await ModuleMaster.findOne({
        where: { moduleKey: "ingredients" },
        attributes: ["id"],
      })
    ).id;
    const moduleToolId = (
      await ModuleMaster.findOne({
        where: { moduleKey: "tool" },
        attributes: ["id"],
      })
    ).id;
    const data = await Recipe.findOne({
      where: filter,
      include: [
        "country",
        { association: "preparationSteps", separate: true },
        { association: "cookingSteps", separate: true },
        { association: "servingSteps", separate: true },
        { association: "recipeTechniques", separate: true, include: "culinaryTechnique" },
        {
          association: "bigChefTools", separate: true, include: [
            {
              association: "tools",
              include: [
                {
                  model: Image,
                  separate: true,
                  required: false,
                  attributes: ["id", "image"],
                  where: { module_id: moduleToolId },
                },
              ]
            }
          ]
        },
        {
          association: "littleChefTools", separate: true, include: [
            {
              association: "tools",
              include: [
                {
                  model: Image,
                  separate: true,
                  required: false,
                  attributes: ["id", "image"],
                  where: { module_id: moduleToolId },
                },
              ]
            }
          ]
        },
        {
          association: "recipeIngredients",
          separate: true,
          include: [
            "unitOfMeasurement",
            { association: "spotlightFacts", separate: true },
            {
              association: "ingredient",
              include: [
                { association: "additionalNutrients", separate: true, required: false, include: "nutrient" },
                { association: "season", required: false },
                {
                  model: Image,
                  separate: true,
                  required: false,
                  attributes: ["id", "image"],
                  where: { module_id: moduleId },
                },
              ],
            },
          ],
        },
      ],
    });
    return data ? data.toJSON() : undefined;
  } catch (err) {
    throw err;
  }
}
async function getLesson(filter) {
  try {
    const data = await Lesson.findOne({
      where: { ...filter, status: true, isDeleted: false },
      include: [
        "grade",
        { association: "recipe", required: true, attributes: [] },
        { association: "links", separate: true },
        { association: "safetySteps", separate: true },
        { association: "cleanupSteps", separate: true },
        { association: "chefIntroductions", separate: true },
        {
          association: "experiment",
          include: [
            { association: "experimentSteps", separate: true },
            {
              association: "experimentQuestions",
              separate: true,
              include: [
                "answer_type",
                {
                  association: "answers",
                  where: { isDelete: false },
                  separate: true,
                  required: false,
                },
                {
                  association: "questionType",
                  attributes: [],
                  where: { key: "experiment" },
                },
              ],
            },
          ],
        },
        {
          association: "activity",
          include: [
            {
              association: "activityQuestions",
              where: { isDelete: false },
              required: false,
              separate: true,
              include: [
                "answer_type",
                {
                  association: "answers",
                  where: { isDelete: false },
                  separate: true,
                  required: false,
                },
                {
                  association: "questionType",
                  attributes: ["key"],
                  where: { key: "activity" },
                },
              ],
            },
          ],
        },
        {
          association: "questions",
          where: { isDelete: false },
          separate: true,
          required: false,
          include: [
            "answer_type",
            {
              association: "answers",
              where: { isDelete: false },
              separate: true,
              required: false,
            },
            {
              association: "questionType",
              attributes: ["key"],
              where: { key: ["ela", "math", "ngss", "ncss"] },
            },
          ],
        },
        {
          association: "multiSensoryQuestions",
          where: { isDelete: false },
          required: false,
          include: [
            "answer_type",
            {
              association: "questionType",
              attributes: ["key"],
              where: { key: ["multiSensory"] },
            },
          ],
        },
      ],
    });
    return data ? data.toJSON() : undefined;
  } catch (err) {
    throw err;
  }
}
async function getOptionFlags(countryId) {
  try {
    const moduleMaster = await ModuleMaster.findOne({ where: { module_key: "country" } });
    let data = await Image.findAll({
      order: sequelize.literal("rand()"),
      limit: 3,
      attributes: ["id", "image", "status", [sequelize.literal(false), "isAnswer"]],
      where: { module_id: moduleMaster.id, transaction_id: { [Op.not]: countryId } },
    });
    data.push(
      await Image.findOne({
        where: { module_id: moduleMaster.id, transaction_id: countryId },
        attributes: ["id", "image", "status", [sequelize.literal(true), "isAnswer"]],
      })
    );
    data = data.sort(() => 0.5 - Math.random());
    return data;
  } catch (err) {
    throw err;
  }
}


// async function getLessonsList(filter, lessonfilter, order, limit) {

//   try {
//     let lessonData = await Lesson.findAll({
//       attributes: [
//         "id",
//         "lessonTitle",
//         "gradeId",
//         "languageId",
//         "isFeatured",
//         "createdAt",
//         "updatedAt",
//         "status",
//       ],
//       where: { ...filter, isFeatured: true },
//       include: [
//         {
//           model: Grade,
//           attributes: ["id", "grade"],
//           // where: lessonfilter.grades.length ? { id: { [Op.in]: lessonfilter.grades } } : {},
//         },
//         {
//           model: BookmarkLesson,
//           attributes: ["lessonId", "isBookmarked"],
//           as: "bookmarkLesson",
//           where: { ...bookmarkFilter },
//           required: bookmarkRequire,
//         },
//         {
//           model: Question,
//           attributes: ["id", "transactionId", "status"],
//           where: { isDelete: false },
//           include: [
//             {
//               model: QuestionStandard,
//               attributes: ["standardId"],
//               where: lessonfilter.standards.length ? { standardId: { [Op.in]: lessonfilter.standards } } : {},
//               as: "standards",
//             }
//           ],
//         },
//       ],
//       order: order,
//       limit: limit
//     });

//     lessonData = JSON.parse(JSON.stringify(lessonData));
//     // recipeFilter.lessonId = { [Op.in]: lessonData.map(obj => obj.id) };

//     let recipeData = await Recipe.findAll({
//       attributes: [
//         "id",
//         "lessonId",
//         "recipeTitle",
//         "recipeImage",
//         "countryId",
//         "holiday",
//         "alternativeName",
//         "estimatedMakeTime",
//         "status",
//       ],
//       where:
//         cookingDurations.length && lessonfilter.seasonal == ""
//           ? {
//             lessonId: { [Op.in]: lessonData.map(obj => obj.id) },
//             [Op.or]: cookingDurations.map((obj) => {
//               return {
//                 estimatedMakeTime: {
//                   [Op.between]: [obj.from, obj.to],
//                 },
//               };
//             }),
//           }
//           : cookingDurations.length && lessonfilter.seasonal !== ""
//             ? {
//               [Op.or]: cookingDurations.map((obj) => {
//                 return {
//                   estimatedMakeTime: {
//                     [Op.between]: [obj.from, obj.to],
//                   },
//                 };
//               }),
//               holiday: lessonfilter.seasonal ? { [Op.not]: null } : { [Op.eq]: null },
//             }
//             : cookingDurations.length == 0 && lessonfilter.seasonal !== ""
//               ? {
//                 holiday: lessonfilter.seasonal ? { [Op.not]: null } : { [Op.eq]: null },
//               }
//               : {},

//       include: [
//         {
//           model: Country,
//           attributes: ["id", "countryName"],
//           where: lessonfilter.countries.length ? { id: { [Op.in]: lessonfilter.countries } } : {},
//         },
//         {
//           model: RecipeTechnique,
//           as: "recipeTechniques",
//           attributes: ["id", "estimatedTime", "culinaryTechniqueId"],
//           where: lessonfilter.culinaryTechniques.length
//             ? { culinaryTechniqueId: { [Op.in]: lessonfilter.culinaryTechniques } }
//             : {},
//         },
//         {
//           model: RecipeIngredient,
//           as: "recipeIngredients",
//           attributes: ["id", "ingredientId"],
//           where: lessonfilter.ingredients.length ? { ingredientId: { [Op.in]: lessonfilter.ingredients } } : {},
//           include: [
//             {
//               model: Ingredient,
//               attributes: ["id", "ingredientTitle"],
//               required: lessonfilter.nutrients.length ? true : false,
//               include: [
//                 {
//                   model: AdditionalNutrient,
//                   attributes: ["id", "ingredientId", "nutrientId"],
//                   as: "additionalNutrients",
//                   where: lessonfilter.nutrients.length ? { nutrientId: { [Op.in]: lessonfilter.nutrients } } : {},
//                 },
//               ],
//             },
//           ],
//         },

//       ],
//       order: order,
//     });

//     recipeData = JSON.parse(JSON.stringify(recipeData));

//     let lessonData = lessonData.map(obj => {
//       return Object.assign(obj, { recipe: recipeData.find(recipeObj => recipeObj.lessonId === obj.id) });
//     });

//     // let topRated = [];
//     return lessonData.filter((obj) => obj.recipe);
//   } catch (err) {
//     throw err;
//   }

// }

//////////////////////////////// MODULES
module.exports = {
  checkNameConflict: async (reqBody, user_id) => {
    try {
      let count = 0;
      if (reqBody.label === "lessonTitle") {
        count = await AssignLesson.count({ where: { title: reqBody.name } });
      } else if (reqBody.label === "settingTitle") {
        if (reqBody.name !== "Default") count = await LessonSetting.count({ where: { setting_name: reqBody.name } });
      } else {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Incorrect label name");
      }

      if (count) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Title or name conflict");
      else return utils.responseGenerator(StatusCodes.OK, "No name conflict");
    } catch (err) {
      throw err;
    }
  },

  getAllLessons: async (req, user_id) => {
    try {
      //fitler
      const filter = {};
      const recipeFilter = {};
      const searchBy = {};
      //order by
      const order = [];
      const orderItem = ["id"];
      const sortOrder = req.query.sort_order;
      sortOrder == "desc" ? orderItem.push("DESC") : orderItem.push("ASC");
      order.push(orderItem);
      let limit = null;
      if (req.query.viewMore && req.query.viewMore.toString() === 'true') limit = null;
      else limit = 3;

      let lessonfilter = {
        grades: [],
        languages: [],
        countries: [],
        ingredients: [],
        cookingTime: [],
        culinaryTechniques: [],
        seasonal: [],
        standards: [],
        nutrients: [],
      };
      req.query.isFeatured === 'true' ? filter.isFeatured = true : null;

      if (req.query.filters) {
        lessonfilter = JSON.parse(req.query.filters);
        if (lessonfilter?.grades?.length) filter.gradeId = { [Op.in]: lessonfilter.grades };
        if (lessonfilter?.languages?.length) filter.languageId = { [Op.in]: lessonfilter.languages };
      }

      if (lessonfilter.seasonal.length == 0) {
        lessonfilter.seasonal = "";
      } else if (lessonfilter.seasonal.length == 1) {
        if (lessonfilter.seasonal[0] == 1) {
          lessonfilter.seasonal = true;
        } else {
          lessonfilter.seasonal = false;
        }
      } else if (lessonfilter.seasonal.length == 2) {
        lessonfilter.seasonal = "";
      }

      const bookmarkFilter = {};
      let bookmarkRequire = false;
      if (req.query.isBookmarked == 1) {
        bookmarkFilter.createdBy = user_id;
        bookmarkFilter.isBookmarked = req.query.isBookmarked;
        bookmarkRequire = true;
      }

      let durationJson = require("../constants/cookingDuration").cookingDuration;
      let cookingDurations = [];
      for (let filterId of lessonfilter.cookingTime) {
        const obj = durationJson.find(item => item.id === filterId)
        cookingDurations.push({ lessonTime: { [Op.between]: [obj.from, obj.to], } });
      }
      let durationCondition = cookingDurations.length ? { [Op.or]: cookingDurations } : undefined;
      //pagging
      const { page_size, page_no = 1 } = req.query;
      //fetch lessons
      let lessonData = await Lesson.findAll({
        attributes: [
          "id",
          "lessonTitle",
          "gradeId",
          "languageId",
          "isFeatured",
          "lessonTime",
          "createdAt",
          "updatedAt",
          "status",
        ],
        where: { ...filter, status: true, isDeleted: false, ...durationCondition },
        include: [
          { association: "recipe", required: true, attributes: [] },
          {
            model: Grade,
            attributes: ["id", "grade"],
          },
          {
            model: BookmarkLesson,
            attributes: ["lessonId", "isBookmarked"],
            as: "bookmarkLesson",
            where: { ...bookmarkFilter },
            required: bookmarkRequire,
          },
          {
            model: Question,
            attributes: ["id", "transactionId", "status"],
            where: { isDelete: false },
            required: lessonfilter.standards.length ? true : false,
            include: [
              {
                model: QuestionStandard,
                attributes: ["standardId"],
                where: lessonfilter.standards.length ? { standardId: { [Op.in]: lessonfilter.standards } } : {},
                as: "standards",
              }
            ],
          },
        ],
        order: order,
        limit: limit
      });
      lessonData = JSON.parse(JSON.stringify(lessonData));
      //fetch ratings of lessons
      let lessonRating = await StudentLessonRating.findAll({
        attributes: [[Sequelize.fn('AVG', Sequelize.col('rating')), "avgRating"], "lessonId"],
        group: ["lessonId"],
        where: { lessonId: lessonData.map(obj => obj.id) }
      });
      lessonRating = JSON.parse(JSON.stringify(lessonRating));

      //fetch recipes of lessons
      let recipeData = await Recipe.findAll({
        attributes: [
          "id",
          "lessonId",
          "recipeTitle",
          "recipeImage",
          "countryId",
          "holiday",
          "alternativeName",
          "estimatedMakeTime",
          "status",
        ],
        where:
          lessonfilter.seasonal === ""
            ? {
              lessonId: { [Op.in]: lessonData.map(obj => obj.id) },
            }
            : {
              lessonId: { [Op.in]: lessonData.map(obj => obj.id) },
              holiday: lessonfilter.seasonal ? { [Op.not]: null } : { [Op.eq]: null },
            },

        include: [
          {
            model: Country,
            attributes: ["id", "countryName"],
            required: lessonfilter.countries.length ? true : false,
            where: lessonfilter.countries.length ? { id: { [Op.in]: lessonfilter.countries } } : {},
          },
          {
            model: RecipeTechnique,
            as: "recipeTechniques",
            attributes: ["id", "estimatedTime", "culinaryTechniqueId"],
            required: lessonfilter.culinaryTechniques.length ? true : false,
            where: lessonfilter.culinaryTechniques.length
              ? { culinaryTechniqueId: { [Op.in]: lessonfilter.culinaryTechniques } }
              : {},
          },
          {
            model: RecipeIngredient,
            as: "recipeIngredients",
            attributes: ["id", "ingredientId"],
            required: lessonfilter.ingredients.length ? true : false,
            where: lessonfilter.ingredients.length ? { ingredientId: { [Op.in]: lessonfilter.ingredients } } : {},
            include: [
              {
                model: Ingredient,
                attributes: ["id", "ingredientTitle"],
                required: lessonfilter.nutrients.length ? true : false,
                include: [
                  {
                    model: AdditionalNutrient,
                    attributes: ["id", "ingredientId", "nutrientId"],
                    as: "additionalNutrients",
                    where: lessonfilter.nutrients.length ? { nutrientId: { [Op.in]: lessonfilter.nutrients } } : {},
                  },
                ],
              },
            ],
          },

        ],
        order: order,
      });
      recipeData = JSON.parse(JSON.stringify(recipeData));
      //data linking
      lessonData = lessonData.map(obj => {
        let recipe = recipeData.find(recipeObj => recipeObj.lessonId === obj.id);
        // binding rating
        let rating = lessonRating.find(item => item.lessonId == obj.id);
        obj.rating = rating ? parseFloat(rating.avgRating).toFixed(1) : null;
        return Object.assign(obj, { recipe });
      });
      let rows = lessonData.filter((obj) => obj.recipe);
      return utils.responseGenerator(StatusCodes.OK, "Lessons fetched", {
        rows
      });
    } catch (err) {
      console.log("err => ", err);
      throw err;
    }
  },



  getTopRatedLessons: async (req, user_id) => {
    try {
      //fitler
      const filter = {};
      const searchBy = {};
      //order by
      const order = [];
      const orderItem = ["id"];
      const sortOrder = req.query.sort_order;
      sortOrder == "desc" ? orderItem.push("DESC") : orderItem.push("ASC");
      order.push(orderItem);
      let limit = null;
      if (req.query.viewMore && req.query.viewMore.toString() === 'true') limit = null;
      else limit = 3;

      //pagging
      const { page_size, page_no = 1 } = req.query;

      const bookmarkFilter = {};
      let bookmarkRequire = false;
      if (req.query.isBookmarked == 1) {
        bookmarkFilter.createdBy = user_id;
        bookmarkFilter.isBookmarked = req.query.isBookmarked;
        bookmarkRequire = true;
      }

      let topRatedData = await StudentLessonRating.findAll({
        attributes: [[Sequelize.fn('AVG', Sequelize.col('rating')), "avgRating"], "lessonId"],
        group: ["lessonId"],
        order: [[Sequelize.col('avgRating'), "DESC"]],
        limit: limit,
      });

      topRatedData = JSON.parse(JSON.stringify(topRatedData));
      topRatedData = topRatedData.map(obj => {
        obj.avgRating = parseFloat(obj.avgRating).toFixed(1);
        return obj;
      });

      let topRatedLessonIds = topRatedData.map(obj => obj.lessonId);

      if (req.query.duration) {
        var today = new Date();
        var priorDate = new Date();
        if (req.query.duration == 'week') filter.createdAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 7)), today] };
        if (req.query.duration == 'month') filter.createdAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 30)), today] };
        if (req.query.duration == 'quarter') filter.createdAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 120)), today] };
        if (req.query.duration == 'year') filter.createdAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 365)), today] };
      }

      let lessonfilter = {
        grades: [],
        languages: [],
        countries: [],
        ingredients: [],
        cookingTime: [],
        culinaryTechniques: [],
        seasonal: [],
        standards: [],
        nutrients: [],
      };

      if (req.query.filters) {
        lessonfilter = JSON.parse(req.query.filters);
        if (lessonfilter?.grades?.length) filter.gradeId = { [Op.in]: lessonfilter.grades };
        if (lessonfilter?.languages?.length) filter.languageId = { [Op.in]: lessonfilter.languages };
      }

      if (lessonfilter.seasonal.length == 0) {
        lessonfilter.seasonal = "";
      } else if (lessonfilter.seasonal.length == 1) {
        if (lessonfilter.seasonal[0] == 1) {
          lessonfilter.seasonal = true;
        } else {
          lessonfilter.seasonal = false;
        }
      } else if (lessonfilter.seasonal.length == 2) {
        lessonfilter.seasonal = "";
      }

      let durationJson = require("../constants/cookingDuration").cookingDuration;
      let cookingDurations = [];
      for (let filterId of lessonfilter.cookingTime) {
        const obj = durationJson.find(item => item.id === filterId)
        cookingDurations.push({ lessonTime: { [Op.between]: [obj.from, obj.to], } });
      }
      let durationCondition = cookingDurations.length ? { [Op.or]: cookingDurations } : undefined;

      if (topRatedLessonIds.length > 0) {
        let lessonData = await Lesson.findAll({
          attributes: [
            "id",
            "lessonTitle",
            "gradeId",
            "isFeatured",
            "lessonTime",
            "createdAt",
            "updatedAt",
            "status",
          ],
          where: { id: { [Op.in]: topRatedLessonIds }, ...filter, status: true, isDeleted: false, ...durationCondition },
          // attributes: { exclude: ["grade_id"] },
          include: [
            { association: "recipe", required: true, attributes: [] },
            {
              model: Grade,
              attributes: ["id", "grade"],
              // where: lessonfilter.grades.length ? { id: { [Op.in]: lessonfilter.grades } } : {},
            },
            {
              model: BookmarkLesson,
              attributes: ["lessonId", "isBookmarked"],
              as: "bookmarkLesson",
              where: { ...bookmarkFilter },
              required: bookmarkRequire,
            },
            {
              model: Question,
              attributes: ["id", "transactionId", "status"],
              where: { isDelete: false },
              required: lessonfilter.standards.length ? true : false,
              include: [
                {
                  model: QuestionStandard,
                  attributes: ["standardId"],
                  where: lessonfilter.standards.length ? { standardId: { [Op.in]: lessonfilter.standards } } : {},
                  as: "standards",
                  include: [
                    {
                      model: Standard,
                      attributes: ["id", "standardTitle"],
                    },
                  ],
                }
              ],
            },
          ],
          order: order,
        });

        lessonData = JSON.parse(JSON.stringify(lessonData));
        let recipeData = await Recipe.findAll({
          attributes: [
            "id",
            "lessonId",
            "recipeTitle",
            "recipeImage",
            "countryId",
            "holiday",
            "alternativeName",
            "estimatedMakeTime",
            "status",
          ],
          where:
            lessonfilter.seasonal === ""
              ? {
                lessonId: { [Op.in]: lessonData.map(obj => obj.id) },
              }
              : {
                lessonId: { [Op.in]: lessonData.map(obj => obj.id) },
                holiday: lessonfilter.seasonal ? { [Op.not]: null } : { [Op.eq]: null },
              },


          include: [
            {
              model: Country,
              attributes: ["id", "countryName"],
              required: lessonfilter.countries.length ? true : false,
              where: lessonfilter.countries.length ? { id: { [Op.in]: lessonfilter.countries } } : {},
            },
            {
              model: RecipeTechnique,
              as: "recipeTechniques",
              attributes: ["id", "estimatedTime", "culinaryTechniqueId"],
              required: lessonfilter.culinaryTechniques.length ? true : false,
              where: lessonfilter.culinaryTechniques.length
                ? { culinaryTechniqueId: { [Op.in]: lessonfilter.culinaryTechniques } }
                : {},
            },
            {
              model: RecipeIngredient,
              as: "recipeIngredients",
              attributes: ["id", "ingredientId"],
              required: lessonfilter.ingredients.length ? true : false,
              where: lessonfilter.ingredients.length ? { ingredientId: { [Op.in]: lessonfilter.ingredients } } : {},
              include: [
                {
                  model: Ingredient,
                  attributes: ["id", "ingredientTitle"],
                  required: lessonfilter.nutrients.length ? true : false,
                  include: [
                    {
                      model: AdditionalNutrient,
                      attributes: ["id", "ingredientId", "nutrientId"],
                      as: "additionalNutrients",
                      where: lessonfilter.nutrients.length ? { nutrientId: { [Op.in]: lessonfilter.nutrients } } : {},
                    },
                  ],
                },
              ],
            },

          ],
          order: order,
        });

        recipeData = JSON.parse(JSON.stringify(recipeData));

        //lesson time and data linking
        let topRated = lessonData.map(obj => {
          let recipe = recipeData.find(recipeObj => recipeObj.lessonId === obj.id);
          return Object.assign(obj, { recipe });
        });
        //assign rating value to toRated object
        for (let i = 0; i < topRated.length; i++) {
          for (let j = 0; j < topRatedData.length; j++) {
            if (topRated[i].id == topRatedData[j].lessonId) {
              topRated[i].rating = topRatedData[j].avgRating;
            }
          }
        }
        topRated.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)); // sort by rating
        topRated = topRated.filter(obj => obj.recipe); // remove object where recipe data not available
        if (req.query.duration) {
          let ratingRound = topRated.map((item) => {
            item.rating = Math.round(item.rating)
            return item.rating
          })

        }
        return utils.responseGenerator(StatusCodes.OK, "Top  rated Lessons fetched", topRated);

      }
      return utils.responseGenerator(StatusCodes.OK, "No lesson data found", []);

    } catch (err) {
      console.log("err => ", err);
      throw err;
    }
  },


  getSuggestedForYouLessons: async (req, user_id) => {
    try {
      //fitler
      const filter = {};
      const searchBy = {};
      //order by
      const order = [];
      const orderItem = ["id"];
      const sortOrder = req.query.sort_order;
      sortOrder == "desc" ? orderItem.push("DESC") : orderItem.push("ASC");
      order.push(orderItem);
      let limit = null;
      if (req.query.viewMore && req.query.viewMore.toString() === 'true') limit = 12;
      else limit = 3;

      //pagging
      const { page_size, page_no = 1 } = req.query;

      const bookmarkFilter = {};
      let bookmarkRequire = false;
      if (req.query.isBookmarked == 1) {
        bookmarkFilter.createdBy = user_id;
        bookmarkFilter.isBookmarked = req.query.isBookmarked;
        bookmarkRequire = true;
      }


      if (req.query.duration) {
        var today = new Date();
        var priorDate = new Date();
        if (req.query.duration == 'week') filter.createdAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 7)), today] };
        if (req.query.duration == 'month') filter.createdAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 30)), today] };
        if (req.query.duration == 'quarter') filter.createdAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 120)), today] };
        if (req.query.duration == 'year') filter.createdAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 365)), today] };
      }

      let lessonfilter = {
        grades: [],
        languages: [],
        countries: [],
        ingredients: [],
        cookingTime: [],
        culinaryTechniques: [],
        seasonal: [],
        standards: [],
        nutrients: [],
      };

      if (req.query.filters) {
        lessonfilter = JSON.parse(req.query.filters);
        if (lessonfilter.grades.length) filter.gradeId = { [Op.in]: lessonfilter.grades };
        //if (lessonfilter.languages.length) filter.languageId = { [Op.in]: lessonfilter.languages };
      }

      if (lessonfilter.seasonal.length == 0) {
        lessonfilter.seasonal = "";
      } else if (lessonfilter.seasonal.length == 1) {
        if (lessonfilter.seasonal[0] == 1) {
          lessonfilter.seasonal = true;
        } else {
          lessonfilter.seasonal = false;
        }
      } else if (lessonfilter.seasonal.length == 2) {
        lessonfilter.seasonal = "";
      }

      /*  let assignedLessonData = await AssignLesson.findAll({
         attributes: [
           [Sequelize.fn('COUNT', Sequelize.col('lesson_id')), "lessonCount"],
           "lesson_id",
         ],
         where: { created_by: user_id },
         group: ["lesson_id"],
         //order: [["lessonCount", "DESC"]],
       });
 
       assignedLessonData = JSON.parse(JSON.stringify(assignedLessonData));
       console.log({ assignedLessonData }); */

      let classData = await Class.findAll({
        attributes: [
          [Sequelize.fn('COUNT', Sequelize.col('grade_id')), "gradeCount"],
          "grade_id",
        ],
        where: { created_by: user_id },
        group: ["grade_id"],
        //order: [["lessonCount", "DESC"]],
      });

      classData = JSON.parse(JSON.stringify(classData));
      //console.log({ classData });

      let lessonData = await Lesson.findAll({
        attributes: [
          "id",
          "lessonTitle",
          "gradeId",
          "isFeatured",
          "lessonTime",
          "createdAt",
          "updatedAt",
          "status",
        ],
        where: {
          ...filter, status: true, isDeleted: false, lessonTime: { [Op.gte]: 60 },
          ...classData?.length > 0 && { grade_id: { [Op.in]: classData.map(obj => obj?.grade_id) } } /* ...durationCondition  */
        },
        // attributes: { exclude: ["grade_id"] },
        include: [
          { association: "recipe", required: true, attributes: [] },
          {
            model: Grade,
            attributes: ["id", "grade"],
            // where: lessonfilter.grades.length ? { id: { [Op.in]: lessonfilter.grades } } : {},
          },
          {
            model: BookmarkLesson,
            attributes: ["lessonId", "isBookmarked"],
            as: "bookmarkLesson",
            where: { ...bookmarkFilter },
            required: bookmarkRequire,
          },
          {
            model: Question,
            attributes: ["id", "transactionId", "status"],
            where: { isDelete: false },
            required: lessonfilter.standards.length ? true : false,
            include: [
              {
                model: QuestionStandard,
                attributes: ["standardId"],
                where: lessonfilter.standards.length ? { standardId: { [Op.in]: lessonfilter.standards } } : {},
                as: "standards",
                include: [
                  {
                    model: Standard,
                    attributes: ["id", "standardTitle"],
                  },
                ],
              }
            ],
          },
        ],
        order: Sequelize.literal('rand()'),
        limit: limit,
      });

      lessonData = JSON.parse(JSON.stringify(lessonData));

      let recipeData = await Recipe.findAll({
        attributes: [
          "id",
          "lessonId",
          "recipeTitle",
          "recipeImage",
          "countryId",
          "holiday",
          "alternativeName",
          "estimatedMakeTime",
          "status",
        ],
        where:
          lessonfilter.seasonal === ""
            ? {
              lessonId: { [Op.in]: lessonData.map(obj => obj.id) },
            }
            : {
              lessonId: { [Op.in]: lessonData.map(obj => obj.id) },
              holiday: lessonfilter.seasonal ? { [Op.not]: null } : { [Op.eq]: null },
            },


        include: [
          {
            model: Country,
            attributes: ["id", "countryName"],
            required: lessonfilter.countries.length ? true : false,
            where: lessonfilter.countries.length ? { id: { [Op.in]: lessonfilter.countries } } : {},
          },
          {
            model: RecipeTechnique,
            as: "recipeTechniques",
            attributes: ["id", "estimatedTime", "culinaryTechniqueId"],
            required: lessonfilter.culinaryTechniques.length ? true : false,
            where: lessonfilter.culinaryTechniques.length
              ? { culinaryTechniqueId: { [Op.in]: lessonfilter.culinaryTechniques } }
              : {},
          },
          {
            model: RecipeIngredient,
            as: "recipeIngredients",
            attributes: ["id", "ingredientId"],
            required: lessonfilter.ingredients.length ? true : false,
            where: lessonfilter.ingredients.length ? { ingredientId: { [Op.in]: lessonfilter.ingredients } } : {},
            include: [
              {
                model: Ingredient,
                attributes: ["id", "ingredientTitle"],
                required: lessonfilter.nutrients.length ? true : false,
                include: [
                  {
                    model: AdditionalNutrient,
                    attributes: ["id", "ingredientId", "nutrientId"],
                    as: "additionalNutrients",
                    where: lessonfilter.nutrients.length ? { nutrientId: { [Op.in]: lessonfilter.nutrients } } : {},
                  },
                ],
              },
            ],
          },

        ],
        order: Sequelize.literal('rand()'),
      });

      recipeData = JSON.parse(JSON.stringify(recipeData));

      //lesson time and data linking
      let suggestedForYou = lessonData.map(obj => {
        let recipe = recipeData.find(recipeObj => recipeObj.lessonId === obj.id);
        return Object.assign(obj, { recipe });
      });

      //suggestedForYou.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)); // sort by rating
      suggestedForYou = suggestedForYou.filter(obj => obj.recipe); // remove object where recipe data not available

      return utils.responseGenerator(StatusCodes.OK, "Top  rated Lessons fetched", suggestedForYou);



    } catch (err) {
      console.log("err => ", err);
      throw err;
    }
  },


  getStandardList: async (req, user_id) => {
    try {

      if (req.query.viewMore && req.query.viewMore.toString() === 'true') limit = null;
      else limit = 3;

      let standardIds = (
        await QuestionStandard.findAll({
          attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('standard_id')), 'standard_id'],],
          limit: limit,
        })).map(obj => obj.toJSON().standard_id);
      //fitler
      let standardList = await Standard.findAll({
        attributes: ["id", "standardTitle", "image"],
        where: { id: standardIds, status: true },
        // limit: limit
      });
      standardList = JSON.parse(JSON.stringify(standardList));

      let lessonData = await Lesson.findAll({
        attributes: [
          "id",
          "status",
        ],
        where: { status: true, isDeleted: false },
        include: [
          { association: "recipe", required: true, attributes: [] },
          {
            model: Question,
            attributes: ["id", "transactionId", "status"],
            where: { isDelete: false },
            required: true,
            include: [
              {
                model: QuestionStandard,
                attributes: ["standardId"],
                where: { standardId: standardIds },
                as: "questionStandards",
              }
            ],
          },
        ],
      });

      lessonData = JSON.parse(JSON.stringify(lessonData));
      let processedData = standardList.map(obj => {
        obj.lessonIds = lessonData.map(lessonData => {
          if (lessonData.questions.filter(ques => ques.questionStandards.standardId === obj.id).length > 0) {
            return lessonData.id;
          }
        });
        obj.lessonIds = obj.lessonIds.filter(myObj => myObj);
        obj.lessonsLength = obj.lessonIds.filter(myObj => myObj).length;
        return obj;
      });
      processedData = processedData.filter(obj => obj.lessonsLength != 0);
      return utils.responseGenerator(StatusCodes.OK, "Standard list fetched", processedData);

    } catch (err) {
      console.log("err => ", err);
      throw err;
    }
  },

  getStandardLessons: async (req, user_id) => {
    try {
      //fitler
      const filter = {};
      //order by
      const order = [];
      const orderItem = ["id"];
      const sortOrder = req.query.sort_order;
      sortOrder == "desc" ? orderItem.push("DESC") : orderItem.push("ASC");
      order.push(orderItem);

      const lessonIds = req.query.lessonIds ? JSON.parse(req.query.lessonIds) : null;

      if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Lesson ids missing");
      }

      let lessonfilter = {
        grades: [],
        languages: [],
        countries: [],
        ingredients: [],
        cookingTime: [],
        culinaryTechniques: [],
        seasonal: [],
        standards: [],
        nutrients: [],
      };

      if (req.query.filters) {
        lessonfilter = JSON.parse(req.query.filters);
        if (lessonfilter.grades.length) filter.gradeId = { [Op.in]: lessonfilter.grades };
        //if (lessonfilter.languages.length) filter.languageId = { [Op.in]: lessonfilter.languages };
      }

      if (lessonfilter.seasonal.length == 0) {
        lessonfilter.seasonal = "";
      } else if (lessonfilter.seasonal.length == 1) {
        if (lessonfilter.seasonal[0] == 1) {
          lessonfilter.seasonal = true;
        } else {
          lessonfilter.seasonal = false;
        }
      } else if (lessonfilter.seasonal.length == 2) {
        lessonfilter.seasonal = "";
      }

      const bookmarkFilter = {};
      let bookmarkRequire = false;
      if (req.query.isBookmarked == 1) {
        bookmarkFilter.createdBy = user_id;
        bookmarkFilter.isBookmarked = req.query.isBookmarked;
        bookmarkRequire = true;
      }

      let durationJson = require("../constants/cookingDuration").cookingDuration;
      let cookingDurations = [];
      for (let elm of durationJson) {
        for (let filterId of lessonfilter.cookingTime) {
          if (elm.id === filterId) {
            cookingDurations.push({ from: elm.from, to: elm.to });
          }
        }
      }

      //pagging
      const { page_size, page_no = 1 } = req.query;

      let lessonData = await Lesson.findAll({
        attributes: [
          "id",
          "lessonTitle",
          "gradeId",
          "languageId",
          "isFeatured",
          "createdAt",
          "updatedAt",
          "status",
        ],
        where: { id: { [Op.in]: lessonIds }, ...filter, status: true, isDeleted: false },
        include: [
          { association: "recipe", required: true, attributes: [] },
          {
            model: Grade,
            attributes: ["id", "grade"],
          },
          {
            model: BookmarkLesson,
            attributes: ["lessonId", "isBookmarked"],
            as: "bookmarkLesson",
            where: { ...bookmarkFilter },
            required: bookmarkRequire,
          },
          {
            model: Question,
            attributes: ["id", "transactionId", "status"],
            where: { isDelete: false },
            include: [
              {
                model: QuestionStandard,
                attributes: ["standardId"],
                where: lessonfilter.standards.length ? { standardId: { [Op.in]: lessonfilter.standards } } : {},
                as: "standards",
              }
            ],
          },
        ],
        order: order,
      });

      lessonData = JSON.parse(JSON.stringify(lessonData));

      let recipeData = await Recipe.findAll({
        attributes: [
          "id",
          "lessonId",
          "recipeTitle",
          "recipeImage",
          "countryId",
          "holiday",
          "alternativeName",
          "estimatedMakeTime",
          "status",
        ],
        where:
          cookingDurations.length && lessonfilter.seasonal == ""
            ? {
              lessonId: { [Op.in]: lessonData.map(obj => obj.id) },
              [Op.or]: cookingDurations.map((obj) => {
                return {
                  estimatedMakeTime: {
                    [Op.between]: [obj.from, obj.to],
                  },
                };
              }),
            }
            : cookingDurations.length && lessonfilter.seasonal !== ""
              ? {
                [Op.or]: cookingDurations.map((obj) => {
                  return {
                    estimatedMakeTime: {
                      [Op.between]: [obj.from, obj.to],
                    },
                  };
                }),
                holiday: lessonfilter.seasonal ? { [Op.not]: null } : { [Op.eq]: null },
              }
              : cookingDurations.length == 0 && lessonfilter.seasonal !== ""
                ? {
                  holiday: lessonfilter.seasonal ? { [Op.not]: null } : { [Op.eq]: null },
                }
                : {},

        include: [
          {
            model: Country,
            attributes: ["id", "countryName"],
            required: lessonfilter.countries.length ? true : false,
            where: lessonfilter.countries.length ? { id: { [Op.in]: lessonfilter.countries } } : {},
          },
          {
            model: RecipeTechnique,
            as: "recipeTechniques",
            attributes: ["id", "estimatedTime", "culinaryTechniqueId"],
            required: lessonfilter.culinaryTechniques.length ? true : false,
            where: lessonfilter.culinaryTechniques.length
              ? { culinaryTechniqueId: { [Op.in]: lessonfilter.culinaryTechniques } }
              : {},
          },
          {
            model: RecipeIngredient,
            as: "recipeIngredients",
            attributes: ["id", "ingredientId"],
            required: lessonfilter.ingredients.length ? true : false,
            where: lessonfilter.ingredients.length ? { ingredientId: { [Op.in]: lessonfilter.ingredients } } : {},
            include: [
              {
                model: Ingredient,
                attributes: ["id", "ingredientTitle"],
                required: lessonfilter.nutrients.length ? true : false,
                include: [
                  {
                    model: AdditionalNutrient,
                    attributes: ["id", "ingredientId", "nutrientId"],
                    as: "additionalNutrients",
                    where: lessonfilter.nutrients.length ? { nutrientId: { [Op.in]: lessonfilter.nutrients } } : {},
                  },
                ],
              },
            ],
          },

        ],
        order: order,
      });

      recipeData = JSON.parse(JSON.stringify(recipeData));

      lessonData = lessonData.map(obj => {
        return Object.assign(obj, { recipe: recipeData.find(recipeObj => recipeObj.lessonId === obj.id) });
      });
      let rows = lessonData.filter((obj) => obj.recipe);

      return utils.responseGenerator(StatusCodes.OK, "Lessons fetched", rows);
    } catch (err) {
      console.log("err => ", err);
      throw err;
    }
  },
  //{%22grades%22:[1],%22countries%22:[],%22culinaryTechniques%22:[],%22ingredients%22:[],%22cookingTime%22:[],%22standards%22:[],%22nutrients%22:[],%22seasonal%22:[]}

  getSearchLessons: async (req, user_id) => {
    try {
      if (!req.query.searchParam) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Search text missing");
      if (!req.query.searchBy) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Search by parameter missing");


      const bookmarkFilter = {};
      let bookmarkRequire = false;

      let lessonData = await Lesson.findAll({
        attributes: [
          "id",
          "lessonTitle",
          "gradeId",
          "languageId",
          "isFeatured",
          "lessonTime",
          "createdAt",
          "updatedAt",
          "status",
        ],
        where: req.query.searchBy === 'lessonTitle' ? { lessonTitle: { [Op.like]: req.query.searchParam + '%' }, status: true, isDeleted: false } : {},
        include: [
          { association: "recipe", required: true, attributes: [] },
          {
            model: Grade,
            attributes: ["id", "grade"],
          },
          {
            model: BookmarkLesson,
            attributes: ["lessonId", "isBookmarked"],
            as: "bookmarkLesson",
            where: { ...bookmarkFilter },
            required: bookmarkRequire,
          },
          {
            model: Question,
            attributes: ["id", "transactionId", "status"],
            where: { isDelete: false },
            include: [
              {
                model: QuestionStandard,
                attributes: ["standardId"],
                as: "standards",
              }
            ],
          },
        ],
      });

      lessonData = JSON.parse(JSON.stringify(lessonData));

      //fetch ratings of lessons
      let lessonRating = await StudentLessonRating.findAll({
        attributes: [[Sequelize.fn('AVG', Sequelize.col('rating')), "avgRating"], "lessonId"],
        group: ["lessonId"],
        where: { lessonId: lessonData.map(obj => obj.id) }
      });
      lessonRating = JSON.parse(JSON.stringify(lessonRating));

      let recipeData = await Recipe.findAll({
        attributes: [
          "id",
          "lessonId",
          "recipeTitle",
          "recipeImage",
          "countryId",
          "holiday",
          "alternativeName",
          "estimatedMakeTime",
          "status",
        ],
        where: req.query.searchBy === 'recipeTitle' ? {
          lessonId: { [Op.in]: lessonData.map(obj => obj.id), },
          recipeTitle: { [Op.like]: req.query.searchParam + '%' }
        }
          : {
            lessonId: { [Op.in]: lessonData.map(obj => obj.id), }
          },
        include: [
          {
            model: Country,
            attributes: ["id", "countryName"],
          },
          {
            model: RecipeTechnique,
            as: "recipeTechniques",
            attributes: ["id", "estimatedTime", "culinaryTechniqueId"],
          },
          {
            model: RecipeIngredient,
            as: "recipeIngredients",
            attributes: ["id", "ingredientId"],
            include: [
              {
                model: Ingredient,
                attributes: ["id", "ingredientTitle"],
                required: false,
                include: [
                  {
                    model: AdditionalNutrient,
                    attributes: ["id", "ingredientId", "nutrientId"],
                    as: "additionalNutrients",
                  },
                ],
              },
            ],
          },

        ],
      });

      recipeData = JSON.parse(JSON.stringify(recipeData));

      lessonData = lessonData.map(obj => {
        // binding rating
        let rating = lessonRating.find(item => item.lessonId == obj.id);
        obj.rating = rating ? parseFloat(rating.avgRating).toFixed(1) : null;
        return Object.assign(obj, { recipe: recipeData.find(recipeObj => recipeObj.lessonId === obj.id) });
      });
      let rows = lessonData.filter((obj) => obj.recipe);

      if (rows.length) return utils.responseGenerator(StatusCodes.OK, "Lessons fetched", rows);
      else return utils.responseGenerator(StatusCodes.OK, "No lesson data found", []);

    } catch (err) {
      console.log("err => ", err);
      throw err;
    }
  },


  getLessonById: async (req, param_id) => {
    try {
      //fitler
      const filter = {};
      filter.id = param_id;
      const searchBy = {};

      const bookmarkFilter = {};
      let bookmarkRequire = false;
      if (req.query.isBookmarked == 1) {
        bookmarkFilter.createdBy = user_id;
        bookmarkFilter.isBookmarked = req.query.isBookmarked;
        bookmarkRequire = true;
      }

      //pagging
      const { page_size, page_no = 1 } = req.query;

      let lessonData = {
        recipe: null,
        lesson: null,
        conversationSentence: null
      }

      lessonData.lesson = await Lesson.findOne({
        where: { ...filter, },
        // attributes: { exclude: ["grade_id"] },
        include: [
          "grade",
          "safetySteps",
          "cleanupSteps",
          { association: "recipe", required: true, attributes: [] },
          {
            association: "experiment",
            include: [
              "experimentSteps",
              {
                model: ExperimentTool,
                attributes: ["toolId"],
                as: "experimentTools",
                include: [
                  {
                    model: Tool,
                    attributes: ["id", "toolTitle"],
                  },
                ],
              },
              {
                association: "experimentQuestions",
                include: [
                  "answer_type",
                  {
                    association: "answers",
                    where: { isDelete: false },
                    required: false,
                  },
                  {
                    association: "questionType",
                    attributes: [],
                    where: { key: "experiment" },
                  },
                ],
              },
            ],
          },
          {
            model: Activity,
            include: [
              {
                association: "activityQuestions",
                where: { isDelete: false },
                required: false,
                include: [
                  "answer_type",
                  {
                    association: "answers",
                    where: { isDelete: false },
                    required: false,
                  },
                  {
                    association: "questionType",
                    attributes: ["key"],
                    where: { key: "activity" },
                  },
                ],
              },
            ]
          },
          {
            model: BookmarkLesson,
            attributes: ["lessonId", "isBookmarked"],
            as: "bookmarkLesson",
            where: { ...bookmarkFilter },
            required: bookmarkRequire,
          },
          {
            model: Language,
            attributes: ["id", "language"],
            as: "language",
          },
          {
            model: Question,
            where: { isDelete: false },
            // as: "elaQuestions",
            required: false,
            include: [
              "answer_type",
              {
                association: "answers",
                where: { isDelete: false },
                required: false,
              },
              // {
              //   model: QuestionStandard,
              //   attributes: ["standardId"],
              //   as: "standards",
              //   //   include: [
              //   //     {
              //   //       model: Standard,
              //   //       attributes: ["id", "standardTitle"],
              //   //     },
              //   //   ],
              // },
              {
                model: QuestionType,
                as: "questionType",
                attributes: ["id", "key", "title", "status"],
                where: { key: ["ela", "math", "ngss", "ncss"] },
              },
            ],
          },
          {
            model: Question,
            as: "multiSensoryQuestions",
            where: { isDelete: false },
            required: false,
            include: [
              // "answer_type",
              // {
              //   model: QuestionStandard,
              //   attributes: ["standardId"],
              //   as: "standards",
              // },
              {
                association: "questionType",
                attributes: ["id", "key", "title", "status"],
                where: { key: ["multiSensory"] },
              },
            ],
          },
        ],
      });
      if (!lessonData.lesson) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Lesson does not exist");
      lessonData.lesson = JSON.parse(JSON.stringify(lessonData.lesson));
      //fetch ratings of lessons
      let lessonRating = await StudentLessonRating.findOne({
        attributes: [[Sequelize.fn('AVG', Sequelize.col('rating')), "avgRating"], "lessonId"],
        group: ["lessonId"],
        where: { lessonId: lessonData.lesson.id }
      });
      lessonRating = JSON.parse(JSON.stringify(lessonRating));
      lessonData.lesson.rating = lessonRating ? parseFloat(lessonRating.avgRating).toFixed(1) : null;

      lessonData.recipe = await getRecipe({ lessonId: lessonData.lesson.id });

      lessonData.recipe.country.matchFlags = await getOptionFlags(lessonData.recipe.countryId);

      // recipeData = JSON.parse(JSON.stringify(recipeData));
      // let lessondData = Object.assign(lessonData, { recipe: recipeData });

      const moduleMaster = await ModuleMaster.findOne({ where: { module_key: "country" } });
      lessonData.recipe.country.matchFlags = await Image.findAll({
        order: sequelize.literal("rand()"),
        limit: 3,
        attributes: ["id", "image", "status", [sequelize.literal(false), "isAnswer"]],
        where: { module_id: moduleMaster.id, transaction_id: { [Op.not]: lessonData.recipe.countryId } },
      });
      lessonData.recipe.country.matchFlags.push(
        await Image.findOne({
          where: { module_id: moduleMaster.id, transaction_id: lessonData.recipe.countryId },
          attributes: ["id", "image", "status", [sequelize.literal(true), "isAnswer"]],
        })
      );

      const { questions } = lessonData.lesson;
      lessonData.lesson.questions = [];

      lessonData.lesson.questions.push(...questions.filter((question) => question.questionType.key == "ela"));
      lessonData.lesson.questions.push(...questions.filter((question) => question.questionType.key == "math"));
      lessonData.lesson.questions.push(...questions.filter((question) => question.questionType.key == "ngss"));
      lessonData.lesson.questions.push(...questions.filter((question) => question.questionType.key == "ncss"));
      lessonData.lesson.conversationSentence = await ConversationSentence.findOne({
        include: [{ association: "category", require: true, where: { title: "Lesson Start" }, attributes: ["title"] }],
      });

      return utils.responseGenerator(StatusCodes.OK, "Lessons fetched", lessonData);
    } catch (err) {
      console.log("err => ", err);
      throw err;
    }
  },

  getLessonInfoData: async (param_id) => {
    let lessonData = {};

    try {
      lessonData = await Lesson.findOne({
        attributes: ["id", "lessonTitle", "learningObjectivesForTeacher", "learningObjectivesForStudent", "gradeId", "languageId"],
        where: { id: param_id },
        include: [
          {
            model: Grade,
            attributes: ["id", "grade", "status"],
            as: "grade"
          },
          {
            model: Language,
            attributes: ["id", "language"],
            as: "language",
          },
          {
            model: Experiment,
            attributes: ["id"],
            include: [
              {
                model: ExperimentTool,
                attributes: ["toolId"],
                as: "experimentTools",
                include: [
                  {
                    model: Tool,
                    attributes: ["id", "toolTitle"],
                  },
                ],
              },
            ],
          },
          {
            model: Question,
            attributes: ["id", "transactionId"],
            where: { isDelete: false },
            // as: "elaQuestions",
            required: false,
            include: [
              {
                model: QuestionStandard,
                attributes: ["standardId"],
                as: "standards",
                include: [
                  {
                    model: Standard,
                    attributes: ["id", "standardTitle"],
                  },
                ],
              },
            ],
          },
        ],
      });

      lessonData = JSON.parse(JSON.stringify(lessonData));
      lessonData.standards = lessonData.questions.map(obj => obj.standards.map(std => std.standard.standardTitle));
      lessonData.standards = lessonData.standards.map(obj => {
        for (elm of obj) return elm;
      });
      lessonData.standards = lessonData.standards.filter(obj => obj !== undefined);
      lessonData.recipe = await Recipe.findOne({
        attributes: ["id", "lessonId", "recipeTitle", "estimatedMakeTime", "countryId"],
        where: {
          lessonId: param_id
        },
        include: [
          {
            model: Country,
            attributes: ["id", "countryName"]
          },
          {
            model: RecipeIngredient,
            attributes: ["id", "recipeId", "ingredientId"],
            as: "recipeIngredients",
            include: [
              {
                model: Ingredient,
                attributes: ["id", "ingredientTitle"]
              },
            ],
          },
        ],
      });

      lessonData = JSON.parse(JSON.stringify(lessonData));
      return utils.responseGenerator(StatusCodes.OK, "Lessons Info data fetched", lessonData);


    } catch (err) {
      console.log("err => ", err);
      throw err;
    }

  },

  assignLesson: async (reqBody, user_id) => {
    const t = await sequelize.transaction();
    try {
      const { lessonId, recipeId, classId } = reqBody;
      if (lessonId) {
        const count = await Lesson.count({ where: { id: lessonId, isDeleted: false } });
        if (!count) {
          return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Lesson do not exist");
        }
      }
      if (recipeId) {
        const count = await Recipe.count({ where: { id: recipeId } });
        if (!count) {
          return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Recipe do not exist");
        }
      }
      if (classId) {
        const count = await Class.count({ where: { id: classId } });
        if (!count) {
          return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Class do not exist");
        }
      }

      reqBody.createdBy = user_id;
      reqBody.updatedBy = user_id;
      if (!reqBody.customSettingId) {
        const lessonSetting = await LessonSetting.create(
          {
            ...reqBody,
          },
          { transaction: t }
        );
        reqBody.customSettingId = lessonSetting ? lessonSetting.dataValues.id : null;
      }

      const assignLesson = await AssignLesson.create({ ...reqBody }, { transaction: t });

      let classStudentData = await ClassStudent.findAll({ attributes: ["studentId"], where: { classId: classId } });
      let roleId = (await Role.findOne({ where: { title: "Student" } })).id;
      let classStudentIds = classStudentData.map(obj => obj.studentId);
      if (classStudentIds.length > 0) {
        let studentIds = [];
        for (const id of classStudentIds) {
          const { isEnable } = await modelHelper.getSetting(id, true, "notiNewStudentAssignment");
          if (isEnable) studentIds.push(id);
        }
        if (studentIds.length > 0) {
          await notificationService.createNotifications(
            studentIds,
            roleId,
            user_id,
            "new_assignment",
            { assignmentName: reqBody.assignmentTitle }
          );
        }
      }
      await t.commit();

      return utils.responseGenerator(StatusCodes.OK, "Lesson Assigned Successfully ", {
        id: assignLesson.id,
        ...reqBody,
      });
    } catch (err) {
      console.log(err);
      await t.rollback();
      throw err;
    }
  },

  customSettingList: async (user_id) => {
    try {
      const settingsList = await LessonSetting.findAll({
        where: { setting_name: { [Op.not]: "Default" }, createdBy: user_id },
      });
      return utils.responseGenerator(StatusCodes.OK, "Custom Settings fetched", settingsList);
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  bookmarkLesson: async (reqBody, param_id, user_id) => {
    try {
      //filter
      const ids = await modelHelper.accessibleIds(user_id);
      const lessonCount = await Lesson.count({
        where: { id: param_id },
      });
      if (!lessonCount) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Lesson does not exist");
      }

      const body = { lessonId: param_id, isBookmarked: reqBody.isBookmarked, createdBy: user_id, updatedBy: user_id };

      const bookmarkDetail = await BookmarkLesson.findOne({
        where: { lessonId: param_id, createdBy: [user_id, ...ids] },
      });

      let result = {};
      if (!bookmarkDetail) {
        result = await BookmarkLesson.create(body);
      } else {
        delete body.lessonId;
        delete body.createdBy;
        result = await BookmarkLesson.update(body, { where: { lessonId: param_id, updatedBy: [user_id, ...ids] } });
      }

      return utils.responseGenerator(StatusCodes.OK, "Bookmark updated successfully", result);
    } catch (err) {
      throw err;
    }
  },
  getAllAssignedLessons: async (req, user_id) => {
    try {
      //filter
      const filter = { deletedAt: null };
      //order by
      const order = [];
      //serach
      const searchBy = {};
      //pagging
      const { page_size, page_no = 1 } = req.query;
      const pagging = {};
      parseInt(page_size) ? (pagging.offset = parseInt(page_size) * (page_no - 1)) : null;
      parseInt(page_size) ? (pagging.limit = parseInt(page_size)) : null;

      /* classIds = req.query.class_id
       ? req.query.class_id
       : (
         await ClassStudent.findAll({
           where: { student_id: user_id},
           attributes: ["classId"],
         })
       ).map((obj) => obj.classId);*/
      if (!req.query.school_id && !req.query.district_id) {
        classIds = req.query.class_id
          ? req.query.class_id
          : (
            await ClassStudent.findAll({
              where: { student_id: user_id },
              attributes: ["classId"],
            })
          ).map((obj) => obj.classId);
      }
      else if (req.query.school_id) {
        const classDetails = await Class.findAll({
          where: { school_id: req.query.school_id },
          attributes: ["id"]
        })

        classIds = classDetails.map((obj) => obj.id)

      }
      else if (req.query.district_id) {
        const classDetails = await Class.findAll({
          where: { district_id: req.query.district_id },
          attributes: ["id"]
        })

        classIds = classDetails.map((obj) => obj.id)

      }

      var today = new Date();
      if (req.query.duration) {
        var priorDate = new Date();
        if (req.query.duration == 'week') filter.createdAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 7)), today] };
        if (req.query.duration == 'month') filter.createdAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 30)), today] };
        if (req.query.duration == 'quarter') filter.createdAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 120)), today] };
        if (req.query.duration == 'year') filter.createdAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 365)), today] };
      }

      const { count, rows } = await AssignLesson.findAndCountAll({
        where: {
          ...filter, classId: classIds, endDate: {
            [Op.gte]: today,
          }
        },
        include: [
          { association: "lesson", where: { status: true, isDeleted: false }, attributes: [] },
          { association: "recipe", required: true, include: ["country"] },
          "customSetting",
          {
            association: "studentProgress",
            where: { student_id: user_id },
            required: false,
          },
        ],
        order: [["created_at", "DESC"]],
        ...pagging,
      });
      const data = [];
      for (row of rows) {
        row = row.toJSON();
        let lessonTime = 0;
        //recipe time
        lessonTime += row.recipe.estimatedMakeTime ? row.recipe.estimatedMakeTime : 0;
        // performance time
        // lessonTime += row.estimatedTimeForPreparation ? row.estimatedTimeForPreparation : 0; only for teacher
        if (row.customSetting) {
          const customSetting = row.customSetting.content;
          //cooking time
          if (customSetting[0].status) lessonTime += customSetting[0].time ? customSetting[0].time : 0;
          //technique time
          for (item of customSetting[0].cooking) if (item.status) lessonTime += item.estimatedTime ? item.estimatedTime : 0;
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
      return utils.responseGenerator(StatusCodes.OK, "Assigned lessons fetched", { count, rows: data });
    } catch (err) {
      throw err;
    }
  },
  getAssignedRecipeTitle: async (req, param_id) => {
    try {
      const filter = { id: param_id, deletedAt: null };
      const data = await AssignLesson.findOne({
        attributes: [],
        where: filter,
        include: [
          { association: "lesson", where: { status: true, isDeleted: false }, attributes: [] },
          { association: "recipe", required: true, attributes: ["recipeTitle", "recipeImage"] },
        ],
      });
      if (!data) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Assigned lesson does not exist");
      }
      return utils.responseGenerator(StatusCodes.OK, "Assigned lesson fetched", data);
    } catch (err) {
      throw err;
    }
  },
  getAssignedLesson: async (req, param_id) => {
    try {
      //filter
      const filter = { id: param_id, deletedAt: null };
      const data = await getAssignment(filter);
      if (!data) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Assigned lesson does not exist");
      }
      [data.recipe, data.lesson, data.conversationSentence] = await Promise.all([
        getRecipe({ id: data.recipeId }),
        getLesson({ id: data.lessonId }),
        ConversationSentence.findOne({
          include: [
            { association: "category", require: true, where: { title: "Lesson Start" }, attributes: ["title"] },
          ],
        }),
      ]);
      if (!data.lesson) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Assigned lesson does not exist");
      data.recipe.country.matchFlags = await getOptionFlags(data.recipe.countryId);
      // apply custom settings on lesson questions
      // if (data.customSetting) {
      //   const assessmentSettings = data.customSetting.content.find((obj) => obj.title == "Assessments");
      //   assessmentSettings.ela = assessmentSettings.Assessments.find((obj) => obj.key == "ela");
      //   const { questions } = data.lesson;
      //   data.lesson.questions = [];
      //   if (questions && assessmentSettings.status) {
      //     assessmentSettings.ela && assessmentSettings.ela.status
      //       ? data.lesson.questions.push(
      //         ...questionss
      //           .filter((question) => question.questionType.key == "ela")
      //           .slice(0, assessmentSettings.ela.totalQuestions)
      //       )
      //       : null;
      //     data.lesson.questions.push(...questions.filter((question) => question.questionType.key == "math"));
      //     data.lesson.questions.push(...questions.filter((question) => question.questionType.key == "ngss"));
      //     data.lesson.questions.push(...questions.filter((question) => question.questionType.key == "ncss"));
      //   }
      // }
      return utils.responseGenerator(StatusCodes.OK, "Assigned lesson fetched", data);
    } catch (err) {
      throw err;
    }
  },
  getLesson: async (req, param_id) => {
    try {
      //filter
      const filter = { id: param_id };
      const data = {};
      data.lesson = await getLesson(filter);
      if (!data) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Lesson does not exist");
      }
      data.recipe = await getRecipe({ lessonId: param_id });
      !!data.recipe.country.matchFlags && (data.recipe.country.matchFlags = await getOptionFlags(data.recipe.countryId));
      data.conversationSentence = await ConversationSentence.findOne({
        include: [{ association: "category", require: true, where: { title: "Lesson Start" }, attributes: ["title"] }],
      });
      return utils.responseGenerator(StatusCodes.OK, "Lesson fetched", data);
    } catch (err) {
      throw err;
    }
  },
  selfAssignLesson: async (reqBody, user_id, isStudent) => {
    try {
      if (!isStudent) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "User not a student");
      const { recipeId } = reqBody;
      const recipe = await Recipe.findOne({ where: { id: recipeId } });
      if (!recipe) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Recipe do not exist");
      }
      reqBody.lessonId = recipe.lessonId;
      reqBody.assignmentTitle = recipe.recipeTitle;
      reqBody.selfAssignedBy = user_id;
      reqBody.defaultSetting = true;
      const selfAssignLesson = await AssignLesson.create(reqBody);
      return utils.responseGenerator(StatusCodes.OK, "Lesson Assigned Successfully ", selfAssignLesson);
    } catch (err) {
      throw err;
    }
  },
  getAssignedLessonByRecipeId: async (id) => {
    try {
      let lessonCount = await AssignLesson.findAndCountAll({
        where: {
          recipeId: id
        }
      })
      return utils.responseGenerator(StatusCodes.OK, "Fetched Lesson Count Successfully", lessonCount)
    }
    catch (err) {
      console.log("error")
    }
  }
};
