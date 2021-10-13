//imports
let utils = require("../helpers/utils");
let { StatusCodes } = require("http-status-codes");

//joi validation
function joiValidator(schema) {
  return function (req, res, next) {
    ////restrict access if not admin
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(utils.responseGenerator(StatusCodes.BAD_REQUEST, error.details[0].message));
    }
    next();
  };
}
//exporting admin
module.exports = joiValidator;
