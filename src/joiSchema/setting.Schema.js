//imports
const Joi = require("joi");
//update
const update = Joi.object({
  settings: Joi.array()
    .items(
      Joi.object().keys({
        id: Joi.number().required(),
        isEnable: Joi.boolean(),
        content: Joi.array().items(Joi.number()),
      })
    )
    .required(),
});
//exporting joi schemas
module.exports = { update };
