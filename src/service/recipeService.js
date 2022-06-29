const Recipe = require("../models").recipes;
const Student = require("../models").students;
let Lesson = require("../models").lessons;
let Grade = require("../models").grades;
const BookmarkLesson = require("../models").bookmark_lessons;
const Question = require("../models").questions;
const QuestionStandard = require("../models").question_standards;
const Standard = require("../models").standards;
const Country = require("../models").countries;
const RecipeTechnique = require("../models").recipe_techniques;
const RecipeIngredient = require("../models").recipe_ingredients;
const Ingredient = require("../models").ingredients;
const AdditionalNutrient = require("../models").additional_nutrients;
const SystemLanguage = require("../models").system_languages;
let utils = require("../helpers/utils");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
let { StatusCodes } = require("http-status-codes");
module.exports = {
  getAllRecipies: async (req) => {
    try {
      //filter
      const countryFilter = {};
      let recipeFilter = {};
      let lessonFilter = {};
      req.query.country ? (countryFilter.countryName = req.query.country) : null;
      req.query.isInternationalRecipe === "true"
        ? (recipeFilter = { [Op.or]: [{ isChefAmbassador: true }, { isChefInHouse: true }] })
        : null;
      if (req.query.systemLanguageKey) {
        const systemLanguage = await SystemLanguage.findOne({ where: { key: req.query.systemLanguageKey } });
        if (!systemLanguage) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "System language key does not exist");
        else lessonFilter.systemLanguageId = systemLanguage.id;
      }
      //order by
      const order = [];
      //serach
      const searchBy = {};
      //pagging
      const { page_size, page_no = 1 } = req.query;
      const pagging = {};
      // association
      let associations = [
        { association: "lesson", required: true, where: { ...lessonFilter, status: true, isDeleted: false }, attributes: ["lessonTime", "gradeId", "systemLanguageId"] },
      ]
      if (req.query.country) associations.push({ association: "country", required: true, where: countryFilter })
      parseInt(page_size) ? (pagging.offset = parseInt(page_size) * (page_no - 1)) : null;
      parseInt(page_size) ? (pagging.limit = parseInt(page_size)) : null;
      const { count, rows } = await Recipe.findAndCountAll({
        where: { status: true, ...recipeFilter },
        include: associations,
        ...pagging,
        order: [["recipeTitle", "ASC"]]
      });

      const data = rows.map(item => {
        // remove preperation time
        item.lesson.lessonTime -= item.estimatedTimeForPreparation ? item.estimatedTimeForPreparation : 0;
        return item;
      })

      return utils.responseGenerator(StatusCodes.OK, "Recipies fetched successfully", { count, rows: data });
    } catch (err) {
      throw err;
    }
  },


  getSuggestedForYouLessons: async (req, user_id) => {
    try {
      //filter
      const countryFilter = {};
      let recipeFilter = {};
      let lessonFilter = {};
      let gradeFilter = req.query.gradeId ? req.query.gradeId : null;
      let lessonTimeFilter = null;

      req.query.country ? (countryFilter.countryName = req.query.country) : null;
      req.query.isInternationalRecipe === "true"
        ? (recipeFilter = { [Op.or]: [{ isChefAmbassador: true }, { isChefInHouse: true }] })
        : null;
      if (req.query.systemLanguageKey) {
        const systemLanguage = await SystemLanguage.findOne({ where: { key: req.query.systemLanguageKey } });
        if (!systemLanguage) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "System language key does not exist");
        else lessonFilter.systemLanguageId = systemLanguage.id;
      }


      let studentData = await Student.findOne({
        where: { id: user_id },
      });

      studentData = JSON.parse(JSON.stringify(studentData));
      //console.log({ studentData });

      //lessontime Filter
      if (!!req.query.lessonTime) {
        let tempTime = req.query.lessonTime;
        if (tempTime >= 0 && tempTime < 30)
          lessonTimeFilter = { [Op.between]: [-1, 30] }
        else if (tempTime >= 30 && tempTime < 60)
          lessonTimeFilter = { [Op.between]: [29, 60] }
        else if (tempTime >= 60 && tempTime < 90)
          lessonTimeFilter = { [Op.between]: [59, 90] }
        else if (tempTime >= 90 && tempTime < 1000)
          lessonTimeFilter = { [Op.between]: [89, 1000] }
      }

      // association
      let associations = [
        {
          association: "lesson",
          required: true,
          where: {
            ...lessonFilter,
            status: true,
            isDeleted: false,
            lessonTime: !lessonTimeFilter ? { [Op.gte]: 60, } : lessonTimeFilter,
            ...!!studentData?.gradeId && { grade_id: studentData?.gradeId },
            ...!!gradeFilter && { grade_id: gradeFilter },
          },
          attributes: ["lessonTime", "gradeId", "systemLanguageId"],
          include: [
            {
              association: "grade",
              attributes: ["id", "grade"],
            }
          ]
        },
      ];

      if (req.query.country)
        associations.push({
          association: "country",
          required: true,
          where: countryFilter
        });



      const { count, rows } = await Recipe.findAndCountAll({
        where: { status: true, ...recipeFilter },
        include: associations,
        //...pagging,
        //order: [["recipeTitle", "ASC"]]
        order: Sequelize.literal('rand()'),
        limit: 3,
      });

      let returnedData = rows;

      if (count < 3) {
        let moreData = await Recipe.findAll({
          where: {
            status: true,
            ...recipeFilter,
            id: { [Op.notIn]: returnedData.map(obj => obj.id) },
          },
          include: associations.filter(item => item?.association !== "country"),
          //...pagging,
          //order: [["recipeTitle", "ASC"]]
          order: Sequelize.literal('rand()'),
          limit: (3 - count),
        });
        moreData = JSON.parse(JSON.stringify(moreData));
        returnedData = [...returnedData, ...moreData];
      }

      const data = returnedData.map(item => {
        // remove preperation time
        //item.lesson.lessonTime -= item.estimatedTimeForPreparation ? item.estimatedTimeForPreparation : 0;
        return item;
      })

      return utils.responseGenerator(StatusCodes.OK, "Recipies fetched successfully", { count, rows: data });
    } catch (err) {
      throw err;
    }
  },

  _getSuggestedForYouLessons: async (req, user_id) => {
    try {
      //fitler
      const filter = {};

      const countryFilter = {};
      let recipeFilter = {};
      let lessonFilter = {};

      req.query.country ? (countryFilter.countryName = req.query.country) : null;
      req.query.isInternationalRecipe === "true"
        ? (recipeFilter = { [Op.or]: [{ isChefAmbassador: true }, { isChefInHouse: true }] })
        : null;
      if (req.query.systemLanguageKey) {
        const systemLanguage = await SystemLanguage.findOne({ where: { key: req.query.systemLanguageKey } });
        if (!systemLanguage) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "System language key does not exist");
        else lessonFilter.systemLanguageId = systemLanguage.id;
      }

      //order by
      const order = [];
      const orderItem = ["id"];
      const sortOrder = req.query.sort_order;
      sortOrder == "desc" ? orderItem.push("DESC") : orderItem.push("ASC");
      order.push(orderItem);
      let limit = 3;



      let studentData = await Student.findOne({
        /* attributes: [
          [Sequelize.fn('COUNT', Sequelize.col('grade_id')), "gradeCount"],
          "grade_id",
        ], */
        where: { id: user_id },
        //order: [["lessonCount", "DESC"]],
      });

      studentData = JSON.parse(JSON.stringify(studentData));
      //console.log({ studentData });

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
          ...!!studentData?.gradeId && { grade_id: studentData?.gradeId } /* ...durationCondition  */
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
            //where: { ...bookmarkFilter },
            //required: bookmarkRequire,
          },
          {
            model: Question,
            attributes: ["id", "transactionId", "status"],
            where: { isDelete: false },
            //required: lessonfilter.standards.length ? true : false,
            include: [
              {
                model: QuestionStandard,
                attributes: ["standardId"],
                //where: lessonfilter.standards.length ? { standardId: { [Op.in]: lessonfilter.standards } } : {},
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
        where: { lessonId: { [Op.in]: lessonData.map(obj => obj.id) }, },


        include: [
          {
            model: Country,
            attributes: ["id", "countryName"],
            //required: lessonfilter.countries.length ? true : false,
            //where: lessonfilter.countries.length ? { id: { [Op.in]: lessonfilter.countries } } : {},
          },
          {
            model: RecipeTechnique,
            as: "recipeTechniques",
            attributes: ["id", "estimatedTime", "culinaryTechniqueId"],
            //required: lessonfilter.culinaryTechniques.length ? true : false,
            //where: lessonfilter.culinaryTechniques.length
            //  ? { culinaryTechniqueId: { [Op.in]: lessonfilter.culinaryTechniques } }
            //  : {},
          },
          {
            model: RecipeIngredient,
            as: "recipeIngredients",
            attributes: ["id", "ingredientId"],
            //required: lessonfilter.ingredients.length ? true : false,
            //where: lessonfilter.ingredients.length ? { ingredientId: { [Op.in]: lessonfilter.ingredients } } : {},
            include: [
              {
                model: Ingredient,
                attributes: ["id", "ingredientTitle"],
                //required: lessonfilter.nutrients.length ? true : false,
                include: [
                  {
                    model: AdditionalNutrient,
                    attributes: ["id", "ingredientId", "nutrientId"],
                    as: "additionalNutrients",
                    //where: lessonfilter.nutrients.length ? { nutrientId: { [Op.in]: lessonfilter.nutrients } } : {},
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


};
