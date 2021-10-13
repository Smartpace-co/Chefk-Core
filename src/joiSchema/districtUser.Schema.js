//imports
const Joi = require("joi");
//create
const create = Joi.object({
  role_id: Joi.number().required(),
  first_name: Joi.string().max(45).required(),
  last_name: Joi.string().max(45).required(),
  email: Joi.string().required(),
  phone_number: Joi.string().required(),
  status: Joi.boolean(),
  parent_id: Joi.number()
});
//file
const file = Joi.object({
  file_name: Joi.string().required(),
  parent_id: Joi.number()

});
//update
const update = Joi.object({
  role_id: Joi.number(),
  first_name: Joi.string().max(45),
  last_name: Joi.string().max(45),
  email: Joi.string(),
  phone_number: Joi.string(),
  address: Joi.string(),
  gender: Joi.string(),
  status: Joi.boolean(),
  parent_id: Joi.number(),
  profile_image: Joi.string().allow(null)
});

//exporting joi schemas
module.exports = { create, update, file };
