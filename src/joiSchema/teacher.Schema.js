//imports
const Joi = require("joi");

//create
const create = Joi.object({
  priceId: Joi.string().allow(null),
  district_id: Joi.number().allow(null),
  school_id: Joi.number().allow(null),
  custom_district_name: Joi.string().max(45),
  custom_school_name: Joi.string().max(45),
  first_name: Joi.string().max(45).required(),
  last_name: Joi.string().max(45).required(),
  email: Joi.string().max(45).required(),
  phone_number: Joi.string().max(45).required(),
  role_id: Joi.number().required(),
  profile_image: Joi.string(),
  address: Joi.string().max(250),
  gender: Joi.string().max(15),
  contact_person_image: Joi.string(),
  contact_person_name: Joi.string().max(45),
  contact_person_number: Joi.string().max(45).allow(""),
  contact_person_email: Joi.string().max(45).allow(""),
  contact_person_address: Joi.string().max(250),
  emergency_contact_number: Joi.string().max(45),
  date: Joi.date(),
  package_id:Joi.number(),
  parent_id: Joi.number(),
  status: Joi.boolean(),
});
//file
const file = Joi.object({
  district_id: Joi.number(),
  school_id: Joi.number(),
  role_id: Joi.number(),
  file_name: Joi.string().required(),
  parent_id: Joi.number()
});
//update
const update = Joi.object({
  district_id: Joi.number().allow(null),
  school_id: Joi.number().allow(null),
  custom_district_name: Joi.string().max(45),
  custom_school_name: Joi.string().max(45),
  first_name: Joi.string().max(45),
  last_name: Joi.string().max(45),
  email: Joi.string().max(45),
  phone_number: Joi.string().max(45),
  role_id: Joi.number(),
  profile_image: Joi.string().allow(null),
  address: Joi.string().max(250),
  gender: Joi.string().max(15),
  contact_person_image: Joi.string(),
  contact_person_name: Joi.string().max(45),
  contact_person_number: Joi.string().max(45),
  contact_person_email: Joi.string().max(45),
  contact_person_address: Joi.string().max(250),
  emergency_contact_number: Joi.string().max(45),
  date: Joi.date(),
  parent_id: Joi.number(),
  parent_role_id:Joi.number(),
  status: Joi.boolean(),
});

// add student to group
const addGroup = Joi.object({
  title: Joi.string(),
  classId: Joi.number(),
  groupColorId: Joi.number(),
  studentIds: Joi.array().items(Joi.number()),
  status: Joi.boolean(),
});

const editGroup = Joi.object({
  title: Joi.string(),
  classId: Joi.number(),
  groupColorId: Joi.number(),
  studentIds: Joi.array().items(Joi.number()),
  status: Joi.boolean(),
});

const colorTitleConflict = Joi.object({
  title: Joi.string(),
  classId: Joi.number(),
  groupColorId: Joi.number()
});

//exporting joi schemas
module.exports = { create, update, file, addGroup, editGroup, colorTitleConflict };
