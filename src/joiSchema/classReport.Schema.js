const Joi = require("joi");
//update
const answerUpdate = Joi.object({
    assignLessonId: Joi.number().required(),
    studentId: Joi.number().required(),
    questionId: Joi.number().required(),
    isCorrect: Joi.boolean().required()
});
//exporting joi schemas
module.exports = { answerUpdate };