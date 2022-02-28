let User = require("../models").users;
let School = require("../models").schools;
let SchoolUser = require("../models").school_users;
const fs = require("fs");
const Role = require("../models/").roles;
let JWTHelper = require("../helpers/jwtHelper");
let modelHelper = require("../helpers/modelHelper");
let utils = require("../helpers/utils");
let fileParser = require("../helpers/fileParser");
let { StatusCodes } = require("http-status-codes");
let stripeHelper = require("../helpers/stripeHelper");
let { schoolUserSettings } = require("../constants/setting");
let { sequelize } = require("../models/index");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];
const file_upload_location = config.file_upload_location;
const generatePasswordPath = config.generate_password_path;
const generatePasswordTemplateId = config.sendgrid.generate_password_template_id;
let notificationService = require("../service/notificationService");

//////////////////////////////// FUNCTIONS
async function createSU(reqBody) {
  const t = await sequelize.transaction();
  try {
    const {parent_id, role_id} = reqBody;

    const password = utils.randomString(10);
    const customer = await stripeHelper.createCustomer(
      reqBody.email,
      reqBody.first_name                      
    );
    const savedUser = await User.create({
      ...reqBody,
      password: await utils.bcryptPassword(password)},
      { transaction: t }
    );

    const savedSchoolUser = await SchoolUser.create({
      ...reqBody,
      parentId:parent_id,
      user_id: savedUser.id,
      customerId: customer.id,
    },
    { transaction: t }
    );

    let accessToken = JWTHelper.getAccessToken(savedUser, savedUser.password);
    let generatePasswordLink = `${generatePasswordPath}?token=${accessToken}`;
    let templateData = {
      generate_password_link: generatePasswordLink,
    };
    await User.update(
      { token: accessToken },
      {
        where: {
          id: savedUser.id,
        },
        transaction: t,
      }
    );
    await modelHelper.addSettings(
      savedSchoolUser.id,
      role_id,
      schoolUserSettings,
      t
    );
    await t.commit();
    utils.sendEmail(reqBody.email, generatePasswordTemplateId, templateData);
    const data = { ...savedUser.dataValues, school_user: savedSchoolUser.dataValues,password: undefined};
    return data;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
async function updateSU(reqBody, param_id, school_id) {
  try {
    const user = await User.update(reqBody, { where: { id: param_id } });
    const school_user = await SchoolUser.update(reqBody, { where: { user_id: param_id } });
    const data = {
      user: user[0],
      school: school_user[0],
    };
    return data;
  } catch (err) {
    throw err;
  }
}

//////////////////////////////// MODULES
module.exports = {
  createSchoolUser: async (reqBody, user_id) => {
    try {
      const loggedUser = await User.findOne({
        where: { id: user_id },
        attributes: { exclude: ["password", "token"] },
        include: ["school"],
      });
      //user not a school admin
      if (!loggedUser.school) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "School do not exist");
      }
      reqBody.parent_role_id = loggedUser.role_id;
      reqBody.createdBy = loggedUser.id;
      reqBody.updatedBy = loggedUser.id;
      reqBody.school_id = loggedUser.school.id;
      const data = await createSU(reqBody);
      await notificationService.createNotifications(
        user_id,
        reqBody.parent_role_id,
        user_id,
        "new_account"
      );
      return utils.responseGenerator(StatusCodes.OK, "Email send successfully", {
        ...data,
      });

    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },

  createSchoolUserFromFile: async (reqBody, user_id) => {
    try {
      const loggedUser = await User.findOne({
        where: { id: user_id },
        attributes: { exclude: ["password", "token"] },
        include: ["school"],
      });
      //user not a school admin
      if (!loggedUser.school) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "School do not exist");
      }
      //process file
      const filePath = file_upload_location + "/" + reqBody.file_name;
      const { data, error } = fileParser.fileParser(filePath);
      if (error) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "File parsing failed", error, true);

      const result = {};
      result.success = [];
      result.failed = [];
      for (row of data) {
        try {
          //validate row
          const { role_title, first_name, last_name, email, phone_number, status } = row;
          if (!role_title || !first_name || !last_name || !email || !phone_number || !status)
            throw "missing info; requiredFeild: role_title, first_name, last_name, email, phone_number, status ";
          const role = await Role.findOne({ where: { title: role_title } });
          if (!role) throw "invalid role title";
          else row.role_id = role.id; // finetunning role
          if (!utils.emailValidation(email)) throw "invalid email";
          const formatedNumber = utils.phoneVerifierFormater(phone_number);
          if (!formatedNumber) throw "inavlid phone_number"; else row.phone_number = formatedNumber;
          if (status.toLowerCase() != "active" && status.toLowerCase() != "inactive") throw "invalid status";
          status.toLowerCase() == "active" ? (row.status = true) : (row.status = false); // finetunning status
          // check if row exists and blongs to school
          const schoolUser = await User.findOne({
            where: { email: email },
            attributes: { exclude: ["password", "token"] },
            include: [
              {
                model: SchoolUser,
                as: "schoolDetails",
                required: false,
                where: { school_id: loggedUser.school.id },
              },
            ],
          });
          // update if exists, create if not
          if (schoolUser) {
            if (!schoolUser.schoolDetails) throw "forbidden access to this user";
            row.updatedBy = loggedUser.id;
            const data = await updateSU(row, schoolUser.id);
            result.success.push({ status: "upated", row });
          } else {
            row.parent_role_id = loggedUser.role_id;
            row.createdBy = loggedUser.id;
            row.updatedBy = loggedUser.id;
            row.school_id = loggedUser.school.id;
            row.parent_id= reqBody.parent_id;
            const data = await createSU(row);
            result.success.push({ status: "created", row });
          }
        } catch (err) {
          result.failed.push({ error: err.toString(), row });
        }
      }
      fs.unlinkSync(filePath);
      if (result.failed.length > 0) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Resulted in error", {
          ...result,
        });
      }
      return utils.responseGenerator(StatusCodes.OK, "All created successfully", {
        ...result,
      });
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },

  getAllSchoolUsers: async (req, user_id) => {
    try {
      const schoolAdmin = await School.findOne({ where: { user_id } });
      //check if logged in user is schoolAdmin
      if (!schoolAdmin) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "School do not exist");

      //fitler
      const filter = {};
      req.query.status ? (filter.status = req.query.status) : null;

      if (req.query.duration) {
        var today = new Date();
        var priorDate = new Date();
        if (req.query.duration == 'week') filter.updatedAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 7)), today] };
        if (req.query.duration == 'month') filter.updatedAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 30)), today] };
        if (req.query.duration == 'quarter') filter.updatedAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 120)), today] };
        if (req.query.duration == 'year') filter.updatedAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 365)), today] };
      }

      const filter2 = {};
      req.query.school_id ? (filter2.school_id = req.query.school_id) : null;
      //serach
      const searchBy = {};
      if (req.query.search) {
        const name = req.query.search.split(" ");
        name[0] ? (searchBy.first_name = name[0]) : null;
        name[1] ? (searchBy.last_name = name[1]) : null;
      }
      //order by
      const order = [];
      const orderItem = req.query.sort_by == "userID" ? ["userID", "userID"] : ["id"];
      const sortOrder = req.query.sort_order;
      sortOrder == "desc" ? orderItem.push("DESC") : orderItem.push("ASC");
      order.push(orderItem);
      //pagging
      const { page_size, page_no = 1 } = req.query;
      const pagging = {};
      parseInt(page_size) ? (pagging.offset = parseInt(page_size) * (page_no - 1)) : null;
      parseInt(page_size) ? (pagging.limit = parseInt(page_size)) : null;

      const { count, rows } = await User.findAndCountAll({
        where: filter,
        attributes: { exclude: ["password", "token"] },
        include: [
          {
            model: SchoolUser,
            as: "schoolDetails",
            required: true,
            where: { school_id: schoolAdmin.id, ...searchBy },
          },
        ],
        ...pagging,
        order: order

      });
      const data = [];
      for (i in rows) {
        data.push(rows[i].dataValues);
        const role = await Role.findOne({ where: { id: rows[i].role_id } });
        data[i].role = role;
        delete data[i].role_id;
      }

      return utils.responseGenerator(StatusCodes.OK, "School users fetched", { count, rows: data });
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },
  getSchoolUser: async (user_id, param_id) => {
    try {
      const schoolAdmin = await School.findOne({ where: { user_id } });
      //check if logged in user is schoolAdmin
      if (!schoolAdmin) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "School do not exist");
      //fetch user with param_id and blongs to loggedin school
      const schoolUser = await User.findOne({
        where: { id: param_id },
        attributes: { exclude: ["password", "token"] },
        include: [
          {
            model: SchoolUser,
            as: "schoolDetails",
            required: true,
            where: { school_id: schoolAdmin.id },
          },
        ],
      });
      if (!schoolUser) return utils.responseGenerator(StatusCodes.OK, "School users fetched", []);

      const role = await Role.findOne({ where: { id: schoolUser.role_id } });
      const data = { ...schoolUser.dataValues, role_id: undefined, role };
      return utils.responseGenerator(StatusCodes.OK, "School users fetched", data);
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },
  getSchoolUserProfile: async (user_id) => {
    try {
      //fetch user with param_id and blongs to loggedin school
      const schoolUser = await User.findOne({
        where: { id: user_id },
        attributes: { exclude: ["password", "token"] },
        include: [
          {
            model: SchoolUser,
            as: "schoolDetails",
            required: true,
          },
        ],
      });
      if (!schoolUser) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "School user not found");
      const role = await Role.findOne({ where: { id: schoolUser.role_id } });
      const data = { ...schoolUser.dataValues, role_id: undefined, role };
      return utils.responseGenerator(StatusCodes.OK, "School users fetched", data);
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },
  updateSchoolUser: async (user_id, param_id, reqBody) => {
    try {
      const schoolAdmin = await School.findOne({ where: { user_id } });
      //check if logged in user is schoolAdmin or user itself
      if (!schoolAdmin) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "School do not exist");
      const count = await User.count({
        where: { id: param_id },
        include: [
          {
            model: SchoolUser,
            as: "schoolDetails",
            required: true,
            where: { school_id: schoolAdmin.id },
          },
        ],
      });
      if (!count) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "School user not found");
      reqBody.updatedBy = user_id;
      const data = await updateSU(reqBody, param_id);
      return utils.responseGenerator(StatusCodes.OK, "Records updated", data);
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },
  updateSchoolUserProfile: async (user_id, reqBody) => {
    try {
      console.log(reqBody)
      const count = await User.count({
        where: { id: user_id },
        include: [
          {
            model: SchoolUser,
            as: "schoolDetails",
            required: true,
          },
        ],
      });
      if (!count) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "School user not found");
      reqBody.updatedBy = user_id;
      const data = await updateSU(reqBody, user_id);
      return utils.responseGenerator(StatusCodes.OK, "Records updated", data);
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },
};
