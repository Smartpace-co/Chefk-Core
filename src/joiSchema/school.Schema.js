//imports
const Joi = require("joi");
//create
const create = Joi.object({
  district_id: Joi.number().allow(null),
  customDistrictName: Joi.string().max(45).allow("").allow(null),
  name: Joi.string().max(45).required(),
  admin_account_name: Joi.string().max(45).required(),
  email: Joi.string().max(45).required(),
  phone_number: Joi.string().max(45).required(),
  role_id: Joi.number().required(),
  school_address: Joi.string().max(250).allow("").allow(null),
  contact_person_name: Joi.string().max(45).required(),
  contact_person_number: Joi.string().max(45).allow("").allow(null),
  contact_person_email: Joi.string().max(45).allow("").allow(null),
  contact_person_address: Joi.string().max(250).allow("").allow(null),
  emergency_contact_number: Joi.string().max(45).allow("").allow(null),
  date: Joi.date(),
  max_user: Joi.number(),
  package_id: Joi.number(),
  parent_id: Joi.number(),
  status: Joi.boolean(),
  isSendPaymentLink: Joi.boolean()

});
//update
const update = Joi.object({
  district_id: Joi.number().allow(null),
  customDistrictName: Joi.string().max(45).allow("").allow(null),
  name: Joi.string().max(45),
  admin_account_name: Joi.string().max(45),
  admin_gender: Joi.string().max(45).allow("").allow(null), //b
  email: Joi.string().max(45),
  phone_number: Joi.string().max(45),
  school_phone_no: Joi.string().max(250).allow("").allow(null), //b
  role_id: Joi.number(),
  admin_address: Joi.string().max(250).allow("").allow(null), //b
  school_address: Joi.string().max(250).allow("").allow(null), //b
  display_name: Joi.string().max(250).allow("").allow(null), //b
  contact_person_name: Joi.string().max(45),
  contact_person_number: Joi.string().max(45).allow("").allow(null),
  contact_person_email: Joi.string().max(45).allow("").allow(null),
  contact_person_title: Joi.string().max(45).allow("").allow(null), //b
  contact_person_gender: Joi.string().max(45).allow("").allow(null), //b
  contact_person_address: Joi.string().max(250).allow("").allow(null), //b
  emergency_contact_number: Joi.string().max(45),
  school_image: Joi.string().allow("").allow(null), //b
  contact_person_image: Joi.string().allow("").allow(null), //b
  profile_image: Joi.string().allow("").allow(null), //b
  date: Joi.date(),
  max_user: Joi.number(),
  package_id: Joi.number(),
  status: Joi.boolean(),
  isSendPaymentLink: Joi.boolean()
});
//checkSchoolNameConflict
const nameConflict = Joi.object({
  name: Joi.string().max(45).required(),
});

//exporting joi schemas
module.exports = { create, update, nameConflict };
