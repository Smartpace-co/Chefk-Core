const jwt = require("jsonwebtoken");
require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];
const accessTokenSecret = config.jwt.access_token;
const loginExpiresIn = config.jwt.login_expires_in;
const resetPasswordExpiresIn = config.jwt.reset_password_expires_in;
let User = require("../models/").users;
let Student = require("../models/").students;

module.exports = {
  //note: password hash is only used when rest token needs to be generated
  getAccessToken(user, passwordHash = "") {
    console.log({loginExpiresIn, resetPasswordExpiresIn})
    const expiresIn = passwordHash == "" ? loginExpiresIn : resetPasswordExpiresIn;
    const accessToken = jwt.sign({ id: user.id, isStudent: false }, accessTokenSecret + passwordHash, {
      expiresIn: expiresIn,
    });
    return accessToken;
  },
  getAccessTokenCleverUser(userId, isStudent = false) {
    const accessToken = jwt.sign({ id: userId, isStudent }, accessTokenSecret , {
      expiresIn: loginExpiresIn,
    });
    return accessToken;
  },
  getStudentAccessToken(user, passwordHash = "") {
    const expiresIn = passwordHash == "" ? loginExpiresIn : resetPasswordExpiresIn;
    const accessToken = jwt.sign({ id: user.id, isStudent: true }, accessTokenSecret + passwordHash, {
      expiresIn: expiresIn,
    });
    return accessToken;
  },
  verifyToken: async (token, passwordHash = "") => {
    try {
      const user = await jwt.verify(token, accessTokenSecret + passwordHash);
      const { isStudent } = user;
      const DB = isStudent ? Student : User;
      const userDetails = await DB.findOne({
        where: { id: user.id },
        attributes: { exclude: ["password", "token", "userName"] },
      });
      return { user, userDetails };
    } catch (err) {
      return { error: err };
    }
  },
};
