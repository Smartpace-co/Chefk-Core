//imports
const Joi = require("joi");
//create
const create = Joi.object({
  note: Joi.string().required(),
});
//update
const update = Joi.object({
  notes: Joi.array().items({ id: Joi.number().required(), note: Joi.string().required() }).required(),
});
const archive = Joi.object({
  ids: Joi.array().items(Joi.number().required()).required(),
});
const unArchive = Joi.object({
  ids: Joi.array().items(Joi.number().required()).required(),
});

//exporting joi schemas
module.exports = { create, update, archive, unArchive };
