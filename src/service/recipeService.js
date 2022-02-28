const Recipe = require("../models").recipes;
const SystemLanguage = require("../models").system_languages;
let utils = require("../helpers/utils");
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
      if( req.query.systemLanguageKey ) {
        const systemLanguage = await SystemLanguage.findOne({where:{key: req.query.systemLanguageKey}});
        if(!systemLanguage) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "System language key does not exist");
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
        { association: "lesson", required: true, where: { ...lessonFilter, status: true, isDeleted: false}, attributes: ["lessonTime", "gradeId", "systemLanguageId"] },
      ]
      if(req.query.country) associations.push( { association: "country", required: true, where: countryFilter })
      parseInt(page_size) ? (pagging.offset = parseInt(page_size) * (page_no - 1)) : null;
      parseInt(page_size) ? (pagging.limit = parseInt(page_size)) : null;
      const { count, rows } = await Recipe.findAndCountAll({
        where: { status: true, ...recipeFilter },
        include: associations,
        ...pagging,
        order: [ ["recipeTitle", "ASC"] ]
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
};
