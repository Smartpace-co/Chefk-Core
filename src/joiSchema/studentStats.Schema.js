//imports
const Joi = require("joi").extend(require("@joi/date"));
//create
const createLessonProgress = Joi.object({
  assignLessonId: Joi.number().required(),
  startedAt: Joi.date().required(),
});
const updateLessonProgress = Joi.object({
  currentScreen: Joi.string(),
  timeTaken: Joi.number(),
  completedStep: Joi.string(),
  endedAt: Joi.date(),
});
const createLessonAnswer = Joi.object({
  assignLessonId: Joi.number().required(),
  questionId: Joi.number().required(),
  answerTypeId: Joi.number().required(),
  answerIds: Joi.array().items(Joi.number().required()),
  essay: Joi.string().allow(null),
  isCorrect: Joi.boolean(),
  isActivityAction: Joi.boolean(),
  pointsEarned: Joi.number(),
});
const addLessonRating = Joi.object({
  lessonId: Joi.number().required(),
  rating: Joi.number().required(),
});
const addItemEarned = Joi.object({
  itemId: Joi.number().required(),
});
const addHealthHygiene = Joi.object({
  healthHygieneId: Joi.number().required(),
  answer: Joi.number().required(),
});
//exporting joi schemas
module.exports = {
  createLessonProgress,
  updateLessonProgress,
  createLessonAnswer,
  addLessonRating,
  addItemEarned,
  addHealthHygiene,
};
