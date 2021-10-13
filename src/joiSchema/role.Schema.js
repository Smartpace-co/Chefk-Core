//imports
const Joi = require("joi");
//create
const create = Joi.object({
  title: Joi.string().max(45).required(),
  module_ids: Joi.array().items(Joi.number()).required(),
  status: Joi.boolean().required(),
});
//update
const update = Joi.object({
  title: Joi.string().max(45),
  description: Joi.string().max(45),
  module_ids: Joi.array().items(Joi.number()),
  status: Joi.boolean(),
});
//checkSchoolNameConflict
const nameConflict = Joi.object({
  name: Joi.string().max(45).required(),
});
//exporting joi schemas
module.exports = { create, update, nameConflict };
