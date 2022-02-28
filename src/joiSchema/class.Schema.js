//imports
const Joi = require("joi");

//create
const create = Joi.object({
  title: Joi.string().max(45).required(),
  district_id: Joi.number().allow(null),
  school_id: Joi.number().allow(null),
  // teacher_id: Joi.number(),
  description: Joi.string().max(250),
  assigned_teacher_ids: Joi.array().items(Joi.number()).min(1).required(),
  grade_id: Joi.number().required(),
  assigned_standard_ids: Joi.array().items(Joi.number()).required(),
  assigned_student_ids: Joi.array().items(Joi.number()).required(),
  number_of_students: Joi.number(),
  parent_id: Joi.number(),
  status: Joi.boolean(),
});
//update
const update = Joi.object({
  title: Joi.string().max(45),
  description: Joi.string().max(250),
  assigned_teacher_ids: Joi.array().items(Joi.number()).min(1),
  grade_id: Joi.number(),
  assigned_standard_ids: Joi.array().items(Joi.number()),
  assigned_student_ids: Joi.array().items(Joi.number()),
  number_of_students: Joi.number(),
  school_id: Joi.number().allow(null),
  status: Joi.boolean(),
});
//checkSchoolNameConflict
const nameConflict = Joi.object({
  name: Joi.string().max(45).required(),
});

//join class
const joinClass = Joi.object({
  teacherId: Joi.number(),
  accessCode: Joi.string().max(45),
});

//exporting joi schemas
module.exports = { create, update, nameConflict, joinClass };
