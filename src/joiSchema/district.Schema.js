//imports
const Joi = require("joi");
//create
const create = Joi.object({
  name: Joi.string().max(45).required(),
  admin_account_name: Joi.string().max(45).required(),
  email: Joi.string().max(45).required(),
  phone_number: Joi.string().max(45).required(),
  role_id: Joi.number().required(),
  contact_person_name: Joi.string().max(45),
  contact_person_no: Joi.string().max(45).allow("").allow(null),
  contact_person_email: Joi.string().max(45).allow("").allow(null),
  package_id: Joi.number(),
  status: Joi.boolean(),
  isSendPaymentLink: Joi.boolean(),
});
//update
const update = Joi.object({
  email: Joi.string().max(45),
  phone_number: Joi.string().max(45),
  profile_image: Joi.string().allow(null),
  admin_account_name: Joi.string().max(45),
  admin_address: Joi.string().max(250).allow("").allow(null),
  admin_gender: Joi.string().max(45).allow(null),
  name: Joi.string().max(45),
  display_name: Joi.string().max(45).allow("").allow(null),
  district_address: Joi.string().max(250).allow("").allow(null),
  district_image: Joi.string().allow(null),
  district_phone_no: Joi.string().max(45).allow(null),
  contact_person_image: Joi.string().allow(null),
  contact_person_name: Joi.string().max(45),
  contact_person_no: Joi.string().max(45).allow("").allow(null),
  contact_person_email: Joi.string().max(45),
  contact_person_gender: Joi.string().max(45).allow(null),
  contact_person_title: Joi.string().max(45).allow("").allow(null),
  package_id: Joi.number(),
  status: Joi.boolean(),
  isSendPaymentLink: Joi.boolean(),
});

//exporting joi schemas
module.exports = { create, update };
