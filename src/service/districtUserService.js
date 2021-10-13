let User = require("../models").users;
let DistrictAdmin = require("../models").district_admins;
let DistrictUser = require("../models").district_users;
let { districtUserSettings } = require("../constants/setting");
let { sequelize } = require("../models/index");

const fs = require("fs");
const Role = require("../models/").roles;
let JWTHelper = require("../helpers/jwtHelper");
let stripeHelper = require("../helpers/stripeHelper");
let modelHelper = require("../helpers/modelHelper");
let notificationService = require("../service/notificationService");

let utils = require("../helpers/utils");
let fileParser = require("../helpers/fileParser");
let { StatusCodes } = require("http-status-codes");

require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];
const resetPasswordPath = config.reset_password_path;
let resetPasswordTemplateId = config.sendgrid.reset_password_template_id;

//////////////////////////////// FUNCTIONS
async function createDU(reqBody) {
  const t = await sequelize.transaction();
  try {
    const {parent_id, role_id} = reqBody;
    

    const password = utils.randomString(10);
    const customer = await stripeHelper.createCustomer(reqBody.email, reqBody.first_name);

    const savedUser = await User.create({
      ...reqBody,
      password: await utils.bcryptPassword(password),
    }, 
    { transaction: t }
    );

    const savedDistrictUser = await DistrictUser.create({
      ...reqBody,
      parentId:parent_id,
      user_id: savedUser.id,
      customerId: customer.id,
    },
    { transaction: t }
    );
    let accessToken = JWTHelper.getAccessToken(savedUser, savedUser.password);
    let resetPasswordLink = `${resetPasswordPath}?token=${accessToken}`;
    let templateData = {
      reset_link: resetPasswordLink,
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
      savedDistrictUser.id,
      role_id,
      districtUserSettings,
      t
    );
    await t.commit();
    await utils.sendEmail(reqBody.email, resetPasswordTemplateId, templateData);
    await notificationService.createNotifications(
      savedUser.id,
      savedUser.role_id,
      id,
      "new_account",
    );
    const data = { ...savedUser.dataValues, district_user: savedDistrictUser.dataValues, password: undefined };
    return data;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
async function updateDU(reqBody, param_id, district_id) {
  try {
    const user = await User.update(reqBody, { where: { id: param_id } });
    const district_user = await DistrictUser.update(reqBody, { where: { user_id: param_id } });
    const data = {
      user: user[0],
      district: district_user[0],
    };
    return data;
  } catch (err) {
    throw err;
  }
}

//////////////////////////////// MODULES
module.exports = {
  createDistrictUser: async (reqBody, user_id) => {
    try {

      const loggedUser = await User.findOne({
        where: { id: user_id },
        attributes: { exclude: ["password", "token"] },
        include: ["district_admin"],
      });
      //user not a district admin
      if (!loggedUser.district_admin) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "District do not exist");
      }
      reqBody.parent_role_id = loggedUser.role_id;
      reqBody.createdBy = loggedUser.id;
      reqBody.updatedBy = loggedUser.id;
      reqBody.district_id = loggedUser.district_admin.id;
      const data = await createDU(reqBody);
     
      return utils.responseGenerator(StatusCodes.OK, "Email send successfully", {
        ...data,
      });
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },

  createDistrictUserFromFile: async (reqBody, user_id) => {
    try {
      const loggedUser = await User.findOne({
        where: { id: user_id },
        attributes: { exclude: ["password", "token"] },
        include: ["district_admin"],
      });
      //user not a district admin
      if (!loggedUser.district_admin) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "District do not exist");
      }
      //process file
      const filePath = process.env.FILE_UPLOAD_LOCATION + "/" + reqBody.file_name;
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
          if (!parseInt(phone_number)) throw "inavlid phone_number";
          if (status.toLowerCase() != "active" && status.toLowerCase() != "inactive") throw "invalid status";
          status.toLowerCase == "active" ? (row.status = true) : (row.status = false); // finetunning status
          // check if row exists and blongs to district
          const districtUser = await User.findOne({
            where: { email: email },
            attributes: { exclude: ["password", "token"] },
            include: [
              {
                model: DistrictUser,
                as: "details",
                required: false,
                where: { district_id: loggedUser.district_admin.id },
              },
            ],
          });
          // update if exists, create if not
          if (districtUser) {
            if (!districtUser.details) throw "forbidden access to this user";
            row.updatedBy = loggedUser.id;
            const data = await updateDU(row, districtUser.id);
            result.success.push({ status: "upated", row });
          } else {
            row.parent_role_id = loggedUser.role_id;
            row.createdBy = loggedUser.id;
            row.updatedBy = loggedUser.id;
            row.district_id = loggedUser.district_admin.id;
            row.parent_id=reqBody.parent_id
            const data = await createDU(row);
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

  getAllDistrictUsers: async (req, user_id) => {
    try {
      const districtAdmin = await DistrictAdmin.findOne({ where: { user_id } });
      //check if logged in user is districtAdmin
      if (!districtAdmin) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "District do not exist");

      //fitler
      const filter = {};
      req.query.status ? (filter.status = req.query.status) : null;

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
            model: DistrictUser,
            as: "details",
            required: true,
            where: { district_id: districtAdmin.id, ...searchBy },
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

      return utils.responseGenerator(StatusCodes.OK, "District users fetched", { count, rows: data });
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },
  getDistrictUser: async (user_id, param_id) => {
    try {

      const districtAdmin = await DistrictAdmin.findOne({ where: { user_id } });
      //check if logged in user is districtAdmin
      if (!districtAdmin) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "District do not exist");
      //fetch user with param_id and blongs to loggedin district
      const districtUser = await User.findOne({
        where: { id: param_id },
        attributes: { exclude: ["password", "token"] },
        include: [
          {
            model: DistrictUser,
            as: "details",
            required: true,
            where: { district_id: districtAdmin.id },
          },
        ],
      });
      if (!districtUser) return utils.responseGenerator(StatusCodes.OK, "District users fetched", []);

      const role = await Role.findOne({ where: { id: districtUser.role_id } });
      const data = { ...districtUser.dataValues, role_id: undefined, role };
      return utils.responseGenerator(StatusCodes.OK, "District users fetched", data);
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },
  getDistrictUserProfile: async (user_id) => {
    try {
      //fetch user with param_id and blongs to loggedin district
      const districtUser = await User.findOne({
        where: { id: user_id },
        attributes: { exclude: ["password", "token"] },
        include: [
          {
            model: DistrictUser,
            as: "details",
            required: true,
          },
        ],
      });
      if (!districtUser) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "District user not found");
      const role = await Role.findOne({ where: { id: districtUser.role_id } });
      const data = { ...districtUser.dataValues, role_id: undefined, role};
      return utils.responseGenerator(StatusCodes.OK, "District users fetched", data);
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },
  updateDistrictUser: async (user_id, param_id, reqBody) => {
    try {
      let count;
      const districtUser = await DistrictUser.findOne({ where: {user_id:param_id } });
      //check if logged in user is districtAdmin or user itself
      if (!districtUser) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "District User do not exist");
      if(districtUser.district_id)
      {
        count = await User.count({
          where: { id: param_id },
          include: [
            {
              model: DistrictUser,
              as: "details",
              required: true,
              where: { district_id: districtUser.district_id },
            },
          ],
        });
      }else{
      count = await User.count({
        where: { id: param_id },
        include: [
          {
            model: DistrictUser,
            as: "details",
            required: true,
            where: { district_id: districtUser.id },
          },
        ],
      });
    }
      if (!count) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "District user not found");
      reqBody.updatedBy = user_id;
      const data = await updateDU(reqBody, param_id);
      return utils.responseGenerator(StatusCodes.OK, "Records updated", data);
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },
  updateDistrictUserProfile: async (user_id, reqBody) => {
    try {
      const count = await User.count({
        where: { id: user_id },
        include: [
          {
            model: DistrictUser,
            as: "details",
            required: true,
          },
        ],
      });
      if (!count) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "District user not found");
      reqBody.updatedBy = user_id;
      const data = await updateDU(reqBody, user_id);
      return utils.responseGenerator(StatusCodes.OK, "Records updated", data);
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },
};
