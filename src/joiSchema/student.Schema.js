//imports
const Joi = require("joi").extend(require("@joi/date"));
//create
const create = Joi.object({
  priceId: Joi.string().allow(null),
  userName: Joi.string().max(45).required(),
  districtId: Joi.number().allow(null),
  customDistrictName: Joi.string().max(45).allow(null, ""),
  schoolId: Joi.number().allow(null),
  customSchoolName: Joi.string().max(45).allow(null, ""),
  classIds: Joi.array().items(Joi.number()),
  gradeId: Joi.number().required(),
  roleId: Joi.number(),
  firstName: Joi.string().max(45).required(),
  lastName: Joi.string().max(45).required(),
  dob: Joi.date().format("YYYY-MM-DD").required(),
  profileImage: Joi.string(),
  address: Joi.string().max(250),
  gender: Joi.string().max(15),
  ethnicityId: Joi.number(),
  allergenIds: Joi.array().items(Joi.number()).required(),
  medicalConditionIds: Joi.array().items(Joi.number()),
  // contactType: Joi.string().valid("parent", "guardian"),
  contactPersonEmail: Joi.string().max(45).required(),
  contactPersonNumber: Joi.string().max(45),
  contactPersonName: Joi.string().max(45),
  contactPersonRelationId: Joi.number(),
  contactPersonGender: Joi.string().max(15),
  emergencyContactNumber: Joi.string().max(45),
  date: Joi.date().format("YYYY-MM-DD"),
  roleId: Joi.number(), // added by ps
  parentId: Joi.number(),
  packageId: Joi.number(),
  status: Joi.boolean(),
});
//file
const file = Joi.object({
  districtId: Joi.number(),
  schoolId: Joi.number(),
  fileName: Joi.string().required(),
  parentId: Joi.number(),
});
//update
const update = Joi.object({
  userName: Joi.string().max(45),
  districtId: Joi.number().allow(null),
  customDistrictName: Joi.string().max(45).allow(null, ""),
  schoolId: Joi.number().allow(null),
  customSchoolName: Joi.string().max(45).allow(null, ""),
  classIds: Joi.array().items(Joi.number()),
  gradeId: Joi.number().required(),
  firstName: Joi.string().max(45),
  lastName: Joi.string().max(45),
  dob: Joi.date().format("YYYY-MM-DD"),
  profileImage: Joi.string(),
  address: Joi.string().max(250),
  gender: Joi.string().max(15),
  ethnicityId: Joi.number(),
  allergenIds: Joi.array().items(Joi.number()),
  medicalConditionIds: Joi.array().items(Joi.number()),
  // contactType: Joi.string().valid("parent", "guardian"),
  contactPersonEmail: Joi.string().max(45),
  contactPersonNumber: Joi.string().max(45),
  contactPersonName: Joi.string().max(45),
  contactPersonRelationId: Joi.number(),
  contactPersonGender: Joi.string().max(15),
  emergencyContactNumber: Joi.string().max(45),
  date: Joi.date().format("YYYY-MM-DD"),
  parentId: Joi.number(),
  status: Joi.boolean(),
});

//checkSchoolNameConflict
const userNameConflict = Joi.object({
  name: Joi.string().max(45).required(),
});

//exporting joi schemas
module.exports = { create, file, update, userNameConflict };
