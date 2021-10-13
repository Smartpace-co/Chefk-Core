let { StatusCodes } = require("http-status-codes");
let utils = require("../helpers/utils");

function pageNotFoundErrorHandler(req, res, next) {
  res
    .status(StatusCodes.NOT_FOUND)
    .send(utils.responseGenerator(StatusCodes.NOT_FOUND, "Not Found"));
}

module.exports = pageNotFoundErrorHandler;
