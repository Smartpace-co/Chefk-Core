let StudentJournal = require("../models").student_journals;
let utils = require("../helpers/utils");
let { StatusCodes } = require("http-status-codes");
const sequelize = require("sequelize");
const Op = sequelize.Op;
module.exports = {
  createJournal: async (reqBody, user_id) => {
    try {
      reqBody.studentId = user_id;

      const studentJournal = await StudentJournal.create(reqBody);
      return utils.responseGenerator(StatusCodes.OK, "Journal entry created successfully", studentJournal);
    } catch (err) {
      throw err;
    }
  },
  getJournal: async (req, user_id) => {
    try {
      //fitler
      const filter = {};
      filter.archivedAt = req.query.archive === "1" ? { [Op.not]: null } : null;
      //serach
      const searchBy = [];
      req.query.searchtext ? searchBy.push({ note: { [Op.like]: "%" + req.query.searchtext + "%" } }) : null;
      req.query.searchdate
        ? searchBy.push(sequelize.where(sequelize.fn("date", sequelize.col("created_at")), "=", req.query.searchdate))
        : null;
      const studentJournal = await StudentJournal.findAll({
        where: {
          studentId: user_id,
          ...filter,
          [Op.and]: searchBy,
        },
        order: [["id", "DESC"]],
      });
      return utils.responseGenerator(StatusCodes.OK, "Journal fetched successfully", studentJournal);
    } catch (err) {
      throw err;
    }
  },
  updateJournal: async (reqBody, user_id) => {
    try {
      const { notes } = reqBody;
      const dataArray = notes.map((n) => {
        return { ...n, studentId: user_id };
      });
      const result = await StudentJournal.bulkCreate(dataArray, {
        updateOnDuplicate: ["note"],
      });

      return utils.responseGenerator(StatusCodes.OK, "Journal updated successfully", result);
    } catch (err) {
      throw err;
    }
  },
  archiveJournal: async (reqBody, user_id) => {
    try {
      const result = await StudentJournal.update(
        { archivedAt: new Date() },
        {
          where: {
            id: reqBody.ids,
          },
        }
      );
      return utils.responseGenerator(StatusCodes.OK, "Journal entries archieved successfully", result);
    } catch (err) {
      throw err;
    }
  },
  unArchiveJournal: async (reqBody, user_id) => {
    try {
      const result = await StudentJournal.update(
        { archivedAt: null },
        {
          where: {
            id: reqBody.ids,
          },
        }
      );
      return utils.responseGenerator(StatusCodes.OK, "Journal entries unarchieved successfully", result);
    } catch (err) {
      throw err;
    }
  },
};
