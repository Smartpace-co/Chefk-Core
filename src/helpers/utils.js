const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];
const jwtAccessToken = config.jwt.access_token;
let saltRound = parseInt(config.bcrypt_salt_round);
let apiKey = config.sendgrid.api_key;
let fromEmail = config.sendgrid.from_email;

module.exports = {
  randomString(length) {
    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHUJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i += 1) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  responseGenerator(status, message, data, isError = false) {
    return {
      status: status,
      message: message.replace(/\"/g, ""),
      [isError ? "error" : "data"]: data,
    };
  },

  passwordComparison(inputPassword, userPassword) {
    return bcrypt.compare(inputPassword, userPassword);
  },

  bcryptPassword(password) {
    return bcrypt.hash(password, saltRound);
  },
  emailValidation: (email) => {
    try {
      const emailRegexp =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      return emailRegexp.test(email);
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },
  phoneVerifierFormater: (number) => {
    try {
      if (parseInt(number)) {
        let match = number.toString().match(/^\+?\d{6,18}$/);
        if (match) {
          return number;
        }
      }
      return null;
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },
  sendEmail: async (email, templateId, templateData) => {
    try {
      sgMail.setApiKey(apiKey);
      const msg = {
        to: email,
        from: fromEmail,
        templateId: templateId,
        dynamic_template_data: templateData || {},
      };
      await sgMail.send(msg);
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },
  excelDateToJSDate: (serial) => {
    const utc_days = Math.floor(serial - 25568);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);

    const fractional_day = serial - Math.floor(serial) + 0.0000001;

    let total_seconds = Math.floor(86400 * fractional_day);

    const seconds = total_seconds % 60;

    total_seconds -= seconds;

    const hours = Math.floor(total_seconds / (60 * 60));
    const minutes = Math.floor(total_seconds / 60) % 60;
    // return new Date((excelDate - (25567 + 1)) * 86400 * 1000);
    return new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate(),
      hours,
      minutes,
      seconds
    );
  },

  getUUID: (prefix) => {
    return prefix + "#" + Date.now();
  },

  encrypt(text) {
    return Buffer.from(text).toString("base64");
  },
};
