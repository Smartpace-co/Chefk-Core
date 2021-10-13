let LogSession = require("../models").log_sessions;
const sequelize = require("sequelize");
const jwtHelper = require("../helpers/jwtHelper");
let utils = require("../helpers/utils");
let { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];

async function authenticateToken(req, res, next) {
  try {
    const token = req.headers.token;
    // check if token exists
    if (token) {
      // verifyToken
      const { user, userDetails, error } = await jwtHelper.verifyToken(token);
      // check if user is guest
      if (!user)
        if (error.name === "TokenExpiredError")
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .send(utils.responseGenerator(StatusCodes.UNAUTHORIZED, "Your session has expired!"));
        else
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .send(utils.responseGenerator(StatusCodes.UNAUTHORIZED, "Invalid Token"));
      if (user.id != null) {
        // check if user exits
        if (!userDetails)
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .send(utils.responseGenerator(StatusCodes.UNAUTHORIZED, "Invalid Token"));
        // check if user is active
        if (!userDetails.status)
          return res
            .status(StatusCodes.FORBIDDEN)
            .send(utils.responseGenerator(StatusCodes.FORBIDDEN, "User Inactive"));
      }
      // update session time
      const path = req.path.split("/")[1];
      if (path != "logout" && path != "notificationCount") {
        await LogSession.update(
          {
            sessionMins: sequelize.fn(
              "timestampdiff",
              sequelize.literal("minute"),
              sequelize.col("sign_in_at"),
              sequelize.fn("NOW")
            ),
          },
          {
            where: {
              sessionToken: token,
            },
          }
        );
      }
      // prepare for next
      req.user = user;
      next();
    } else {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send(utils.responseGenerator(StatusCodes.UNAUTHORIZED, "Invalid Token"));
    }
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(utils.responseGenerator(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err.toString(), true));
  }
}

module.exports = authenticateToken;
