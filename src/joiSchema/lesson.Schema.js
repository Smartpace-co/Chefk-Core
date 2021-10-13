const Joi = require("joi");

//create
const assign = Joi.object({
  lessonId: Joi.number().required(),
  recipeId: Joi.number().required(),
  classId: Joi.number().required(),
  assignmentTitle: Joi.string().max(45).required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  defaultSetting: Joi.boolean(),
  customSettingId: Joi.number(),
  settingName: Joi.string().max(45),
  content: Joi.array().items(Joi.object())
});

//create
const updateAssignment = Joi.object({
    classId: Joi.number(),
    assignmentTitle: Joi.string().max(45),
    startDate: Joi.date(),
    endDate: Joi.date(),
    defaultSetting: Joi.boolean(),
    customSettingId: Joi.number(),
    settingName: Joi.string().max(45),
    content: Joi.array().items(Joi.object())
});

//lesson tile and setting title conlictrt
const nameConflict = Joi.object({
  name: Joi.string().max(45).required(),
  label: Joi.string().max(45).required()
});

const bookmark =  Joi.object({
  isBookmarked: Joi.boolean().required(),
});

//selfAssign
const selfAssign = Joi.object({
  recipeId: Joi.number().required(),
});

//exporting joi schemas
module.exports = { assign, updateAssignment, nameConflict, bookmark, selfAssign };
