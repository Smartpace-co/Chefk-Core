let { StatusCodes } = require("http-status-codes");
let utils = require("../helpers/utils");

function globalErrorHandler(err, req, res, next) {
  console.log("Error ==> ", err + "\n" + err.toString());
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send(utils.responseGenerator(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err.toString(), true));
}

module.exports = globalErrorHandler;
