const ModuleMaster = require("../models").module_master;
const Category = require("../models").categories;
const ImageDragDrop = require("../models").image_drag_drops;
const Country = require("../models").countries;
const Image = require("../models").images;
const ImageFlipContent = require("../models").image_flip_contents;
const { Op } = require("sequelize");
const { sequelize } = require("../models/index");
const utils = require("../helpers/utils");
const modelHelper = require("../helpers/modelHelper");
const { StatusCodes } = require("http-status-codes");

module.exports = {
  imageDragDrop: async () => {
    try {
      const data = [];
      const totalLevels = 3;
      const questionsInLevelOne = 3;
      const itemsPerQuestion = 3;

      const moduleId = (await ModuleMaster.findOne({ where: { module_key: "imageDragDrop" } }))["id"];
      const categoryIds = (await Category.findAll({ where: { moduleId: moduleId }, limit: totalLevels })).map(
        (item) => item.id
      );
      // fetching items in rounds(categories)
      let levelFactor = 0;
      for (categoryId of categoryIds) {
        const limit = (questionsInLevelOne + levelFactor) * itemsPerQuestion;
        const items = await ImageDragDrop.findAll({
          where: { categoryId: categoryId },
          include: [
            {
              association: "images",
              required: false,
              where: {
                transactionId: sequelize.literal("image_drag_drops.id"),
                moduleId: moduleId,
              },
            },
          ],
          order: sequelize.literal("rand()"),
          limit: limit,
        });
        levelFactor++;
        //grouping items into questions
        let itemCounter = 0;
        let subQuestions = [];
        let options = [];
        for (item of items) {
          itemCounter++;
          subQuestions.push({ id: item.id, question: item.title });
          options.push({ id: item.id, src: item.images[0] ? item.images[0].image : null });
          if (itemCounter === itemsPerQuestion) {
            data.push({
              level: levelFactor,
              subQuestions: subQuestions.sort(() => 0.5 - Math.random()),
              options: options.sort(() => Math.random() - 0.5),
            }); // shuffle options
            itemCounter = 0;
            subQuestions = [];
            options = [];
          }
        }
        if (subQuestions.length !== 0) {
          data.push({
            level: levelFactor,
            subQuestions: subQuestions.sort(() => 0.5 - Math.random()),
            options: options.sort(() => Math.random() - 0.5),
          }); // shuffle options
          subQuestions = []; //unnecessary line
          options = []; //unnecessary line
        }
      }
      return utils.responseGenerator(StatusCodes.OK, "Questions fetched successfully", data);
    } catch (err) {
      throw err;
    }
  },
  flagMatch: async () => {
    try {
      const data = [];
      const totalLevels = 3;
      const questionsInLevelOne = 3;
      const flagsPerQuestion = 4;
      const totalQuestions = totalLevels * questionsInLevelOne + 3; // 3 is sum of extra questions in every level
      const levelInterval = [3, 7, 12]; // how many questions till some level
      // fetching countries and flags
      const countries = await Country.findAll({
        order: sequelize.literal("rand()"),
        limit: totalQuestions,
      });
      const countryIds = countries.map((item) => item.id);
      const moduleId = (await ModuleMaster.findOne({ where: { module_key: "country" } }))["id"];

      const answerFlags = await Image.findAll({
        attributes: ["id", "image", "status", "transactionId", [sequelize.literal(true), "isAnswer"]],
        where: { module_id: moduleId, transaction_id: countryIds },
      });
      const nonAnswerFlags = await Image.findAll({
        attributes: ["id", "image", "status", "transactionId", [sequelize.literal(false), "isAnswer"]],
        where: { module_id: moduleId, transaction_id: { [Op.not]: countryIds } },
        order: sequelize.literal("rand()"),
        limit: answerFlags.length * (flagsPerQuestion - 1),
      });
      //grouping flags into questions
      let level = 1;
      let itemCounter = 0;
      let questionCounter = 0;
      let questionCountry = {};
      let optionFlags = [];

      for (nonAnswerFlag of nonAnswerFlags) {
        itemCounter++; // rest after every question
        optionFlags.push(nonAnswerFlag);
        if (itemCounter === flagsPerQuestion - 1) {
          popedFlag = answerFlags.pop();
          optionFlags.push(popedFlag);
          questionCountry = countries.find((i) => i.id === popedFlag.transactionId);
          data.push({
            level,
            questionCountry,
            optionFlags: optionFlags.sort(() => Math.random() - 0.5),
          }); // shuffle options
          itemCounter = 0;
          optionFlags = [];
          questionCounter++;
          levelInterval.includes(questionCounter) ? level++ : null; // increment level on condition
        }
      }

      return utils.responseGenerator(StatusCodes.OK, "Questions fetched successfully", data);
    } catch (err) {
      throw err;
    }
  },
  imageFlip: async () => {
    try {
      const data = [];
      const totalLevels = 3;
      const questionsPerLevel = 1;
      const itemsPerQuestion = 8;

      const moduleId = (await ModuleMaster.findOne({ where: { module_key: "imageFlipContent" } }))["id"];
      const categoryIds = (await Category.findAll({ where: { moduleId: moduleId }, limit: totalLevels })).map(
        (item) => item.id
      );
      // fetching items in rounds(categories)
      let level = 0;
      for (categoryId of categoryIds) {
        const limit = questionsPerLevel * (itemsPerQuestion / 2);
        const items = await ImageFlipContent.findAll({
          where: { categoryId: categoryId },
          include: [
            {
              association: "images",
              required: false,
              where: {
                transactionId: sequelize.literal("image_flip_contents.id"),
                moduleId: moduleId,
              },
            },
          ],
          order: sequelize.literal("rand()"),
          limit: limit,
        });
        level++;
        //grouping items into questions
        let itemCounter = 0;
        let options = [];
        for (item of items) {
          itemCounter += 2;
          options.push({ id: item.id, src: item.images[0] ? item.images[0].image : null });
          options.push({ id: item.id, src: item.images[0] ? item.images[0].image : null });
          if (itemCounter === itemsPerQuestion) {
            data.push({ level: level, options: options.sort(() => Math.random() - 0.5) }); // shuffle options
            itemCounter = 0;
            options = [];
          }
        }
        if (options.length !== 0) {
          data.push({ level: level, options: options.sort(() => Math.random() - 0.5) }); // shuffle options
          options = []; //unnecessary line
        }
      }
      return utils.responseGenerator(StatusCodes.OK, "Questions fetched successfully", data);
    } catch (err) {
      throw err;
    }
  },
};
