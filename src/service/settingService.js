let Setting = require("../models").settings;
let SystemLanguage = require("../models").system_languages;
let Student = require("../models").students;
let utils = require("../helpers/utils");
let { StatusCodes } = require("http-status-codes");
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];
let generalTemplateId = config.sendgrid.general_template_id;

module.exports = {
  async getSettings(req, user_id, entityId) {
    try {
      const { role_id: roleId } = req.query;
      //fitler
      const filter = {};
      filter.entityId = parseInt(entityId);
      filter.roleId = roleId ? roleId : null;
      //serach
      const searchBy = {};
      const settings = await Setting.findAll({
        where: { ...filter },
      });
      return utils.responseGenerator(StatusCodes.OK, "All Settings fetched successfully", settings);
    } catch (err) {
      throw err;
    }
  },
  async getPreferedLanguage(req, user_id, entityId) {
    try {
      const { role_id: roleId } = req.query;
      //fitler
      const filter = { key: "languageSetYourPreferredLanguage" };
      filter.entityId = parseInt(entityId);
      filter.roleId = roleId ? roleId : null;

      const setting = await Setting.findOne({
        where: { ...filter },
      });
      const languageId = setting ? (setting.content ? setting.content[0] : null) : null;
      const language = languageId ? await SystemLanguage.findOne({ where: { id: languageId } }) : null;
      return utils.responseGenerator(StatusCodes.OK, "Prefered Language fetched successfully", language);
    } catch (err) {
      throw err;
    }
  },
  async updateSettings(reqBody, user_id, isStudent) {
    try {
      const { settings } = reqBody;
      const dataArray = settings.map((setting) => {
        return { ...setting, updatedBy: !isStudent ? user_id : null };
      });
      const setting = await Setting.bulkCreate(dataArray, {
        updateOnDuplicate: ["isEnable", "content", "updatedBy"],
      });
      // send email to parent if student updates settings
      if (isStudent) {
        const student = await Student.findOne({ where: { id: user_id } });
        let templateData = {
          subject: "Notification",
          header: "Settings Updated",
          content: `Student ${student.firstName} ${student.lastName} has changed setting`,
        };
        utils.sendEmail(student.contactPersonEmail, generalTemplateId, templateData);
      }
      return utils.responseGenerator(StatusCodes.OK, "Settings updated successfully", setting);
    } catch (err) {
      throw err;
    }
  },
};
