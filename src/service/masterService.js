require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];
const db = require("../models/index");
let District = require("../models").districts;
let Grade = require("../models").grades;
let Subject = require("../models").subjects;
let Standard = require("../models").standards;
let Ethnicity = require("../models").ethnicities;
let Relation = require("../models").relations;
let MedicalCondition = require("../models").medical_conditions;
let FAQ = require("../models").faqs;
let HelpContact = require("../models").help_contacts;
let SystemLanguage = require("../models").system_languages;
let GroupColor = require("../models").group_colors;
let Allergen = require("../models").allergens;
const Language = require("../models").languages;
const Country = require("../models").countries;
const Ingredient = require("../models").ingredients;
const CulinaryTechnique = require("../models").culinary_techniques;
const Nutrients = require("../models").nutrients;


const { Op } = require("sequelize");
let utils = require("../helpers/utils");
let { StatusCodes } = require("http-status-codes");
require("dotenv").config();

module.exports = {
  getAllGrades: async () => {
    try {
      const grades = await Grade.findAll({});
      return utils.responseGenerator(StatusCodes.OK, "Grades fetched", grades);
    } catch (err) {
      throw err;
    }
  },
  getAllStandards: async () => {
    try {
      const standards = await Standard.findAll({});
      return utils.responseGenerator(
        StatusCodes.OK,
        "Standards fetched",
        standards
      );
    } catch (err) {
      throw err;
    }
  },
  getAllEthnicities: async () => {
    try {
      const ethnicities = await Ethnicity.findAll({});
      return utils.responseGenerator(
        StatusCodes.OK,
        "Ethnicities fetched",
        ethnicities
      );
    } catch (err) {
      throw err;
    }
  },
  getAllRelations: async (req) => {
    try {
      const filter = {};
      req.query.type ? (filter.type = req.query.type) : null;
      const relations = await Relation.findAll({ where: filter });
      return utils.responseGenerator(
        StatusCodes.OK,
        "Relations fetched",
        relations
      );
    } catch (err) {
      throw err;
    }
  },
  getAllMedicalConditions: async () => {
    try {
      const medicalConditions = await MedicalCondition.findAll({});
      return utils.responseGenerator(
        StatusCodes.OK,
        "Medical Conditions fetched",
        medicalConditions
      );
    } catch (err) {
      throw err;
    }
  },
  getAllFAQs: async (req) => {
    try {
      //fitler
      const filter = {};
      req.query.status ? (filter.status = req.query.status) : null;
      //serach
      const searchBy = {};
      req.query.search
        ? (searchBy.question = { [Op.like]: "%" + req.query.search + "%" })
        : null;
      //pagging
      const { page_size, page_no = 1 } = req.query;
      const pagging = {};
      parseInt(page_size)
        ? (pagging.offset = parseInt(page_size) * (page_no - 1))
        : null;
      parseInt(page_size) ? (pagging.limit = parseInt(page_size)) : null;

      const { count, rows } = await FAQ.findAndCountAll({
        where: { ...filter, ...searchBy },
        ...pagging,
      });
      return utils.responseGenerator(
        StatusCodes.OK,
        "FAQs fetched successfully",
        { count, rows }
      );
    } catch (err) {
      throw err;
    }
  },
  getAllHelpContacts: async (req) => {
    try {
      //fitler
      const filter = {};
      req.query.status ? (filter.status = req.query.status) : null;
      //serach
      const searchBy = {};
      //pagging
      const { page_size, page_no = 1 } = req.query;
      const pagging = {};
      parseInt(page_size)
        ? (pagging.offset = parseInt(page_size) * (page_no - 1))
        : null;
      parseInt(page_size) ? (pagging.limit = parseInt(page_size)) : null;

      const { count, rows } = await HelpContact.findAndCountAll({
        where: { ...filter, ...searchBy },
        ...pagging,
      });
      return utils.responseGenerator(
        StatusCodes.OK,
        "Help contacts fetched successfully",
        { count, rows }
      );
    } catch (err) {
      throw err;
    }
  },
  getAllSubjects: async (req) => {
    try {
      //fitler
      const filter = {};
      req.query.status ? (filter.status = req.query.status) : null;
      //serach
      const searchBy = {};
      //pagging
      const { page_size, page_no = 1 } = req.query;
      const pagging = {};
      parseInt(page_size)
        ? (pagging.offset = parseInt(page_size) * (page_no - 1))
        : null;
      parseInt(page_size) ? (pagging.limit = parseInt(page_size)) : null;

      const { count, rows } = await Subject.findAndCountAll({
        where: { ...filter, ...searchBy },
        ...pagging,
      });
      return utils.responseGenerator(
        StatusCodes.OK,
        "Subjects fetched successfully",
        { count, rows }
      );
    } catch (err) {
      throw err;
    }
  },
  getAllSystemLanguages: async (req) => {
    try {
      let data = [];
      if (req.query.id && req.query.model) {
        const { id, model } = req.query;
        data = await SystemLanguage.findAll({
          attributes: [
            "id",
            "title",
            [
              db.Sequelize.literal(
                `case when isnull(${model}.id) then TRUE ELSE FALSE END`
              ),
              "is_enable",
            ],
          ],
          include: [
            {
              model: db[model],
              as: model,
              attributes: [],
              on: {
                system_language_id: {
                  [Op.eq]: db.Sequelize.col("system_languages.id"),
                },
                [Op.or]: [{ id: id }, { reference_id: id }],
              },
            },
          ],
        });
      } else {
        //fitler
        const filter = {};
        req.query.status ? (filter.status = req.query.status) : null;
        data = await SystemLanguage.findAll({
          attributes: [
            "id",
            "title",
            "key",
            "status",
            [db.Sequelize.literal(true), "is_enable"],
          ],
          where: { ...filter },
        });
      }
      return utils.responseGenerator(
        StatusCodes.OK,
        "Languages fetched successfully",
        data
      );
    } catch (err) {
      throw err;
    }
  },

  getAllGroupColors: async (req) => {
    try {
      //fitler
      const data = await GroupColor.findAll({});
      return utils.responseGenerator(
        StatusCodes.OK,
        "Colors list fetched successfully",
        data
      );
    } catch (err) {
      throw err;
    }
  },
  getAllAllergens: async (req) => {
    try {
      //fitler
      const data = await Allergen.findAll({});
      return utils.responseGenerator(
        StatusCodes.OK,
        "Allergens fetched successfully",
        data
      );
    } catch (err) {
      throw err;
    }
  },

  getAllLanguages: async (req) => {
    try {
      //fitler
      const data = await Language.findAll({});
      return utils.responseGenerator(
        StatusCodes.OK,
        "Languages fetched successfully",
        data
      );
    } catch (err) {
      throw err;
    }
  },

  getAllCountries: async (req) => {
    try {
      //fitler
      const data = await Country.findAll({});
      return utils.responseGenerator(
        StatusCodes.OK,
        "Countries fetched successfully",
        data
      );
    } catch (err) {
      throw err;
    }
  },

  getAllIngredients: async (req) => {
    try {
      //fitler
      const data = await Ingredient.findAll({});
      return utils.responseGenerator(
        StatusCodes.OK,
        "Ingredients fetched successfully",
        data
      );
    } catch (err) {
      throw err;
    }
  },

  getAllICulinaryTechniques: async (req) => {
    try {
      //fitler
      const data = await CulinaryTechnique.findAll({});
      return utils.responseGenerator(
        StatusCodes.OK,
        "Ingredients fetched successfully",
        data
      );
    } catch (err) {
      throw err;
    }
  },

  getAllFiltersList: async (req) => {
    try {
      //fitler
      const grades = await Grade.findAll({});
      const standards = await Standard.findAll({});
      const languages = await Language.findAll({});
      const countries = await Country.findAll({});
      const ingredients = await Ingredient.findAll({});
      const culineryTechniques = await CulinaryTechnique.findAll({});
      const cookingDuration = require("../constants/cookingDuration").cookingDuration;
      const nutrients = await Nutrients.findAll({});

      return utils.responseGenerator(
        StatusCodes.OK,
        "Filters List fetched successfully",
        { grades, standards, languages, countries, ingredients, culineryTechniques, cookingDuration, nutrients }
      );
    } catch (err) {
      throw err;
    }
  },
};
