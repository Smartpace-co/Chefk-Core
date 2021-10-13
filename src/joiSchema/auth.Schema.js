//imports
const Joi = require("joi");

//login
const login = Joi.object({
  email: Joi.string().max(45).required(),
  password: Joi.string().max(45).required(),
});
//student login
const studentLogin = Joi.object({
  userName: Joi.string().max(45).required(),
  password: Joi.string().max(45).required(),
});
//forgot password
const forgotPassword = Joi.object({
  email: Joi.string().max(45).required(),
});
//student forgot password
const studentForgotPassword = Joi.object({
  userName: Joi.string().max(45).required(),
});
// reset password
const resetPassword = Joi.object({
  password: Joi.string().required(),
});
// change password
const changePassword = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});
//exporting joi schemas
module.exports = { login, studentLogin, forgotPassword, studentForgotPassword, resetPassword, changePassword };
