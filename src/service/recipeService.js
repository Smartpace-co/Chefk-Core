const Recipe = require("../models").recipes;
let utils = require("../helpers/utils");
let { StatusCodes } = require("http-status-codes");
module.exports = {
  getAllRecipies: async (req) => {
    try {
      //filter
      const filter = {};
      req.query.country ? (filter.countryName = req.query.country) : null;
      //order by
      const order = [];
      //serach
      const searchBy = {};
      //pagging
      const { page_size, page_no = 1 } = req.query;
      const pagging = {};
      parseInt(page_size) ? (pagging.offset = parseInt(page_size) * (page_no - 1)) : null;
      parseInt(page_size) ? (pagging.limit = parseInt(page_size)) : null;
      const { count, rows } = await Recipe.findAndCountAll({
        where: { status: true },
        include: [
          { association: "country", required: true, where: filter, attributes: [] },
          { association: "lesson", required: true, where: { status: true }, attributes: [] },
        ],
        ...pagging,
      });
      return utils.responseGenerator(StatusCodes.OK, "Recipies fetched successfully", { count, rows });
    } catch (err) {
      throw err;
    }
  },
};
