const db = require("../models/index");
let User = require("../models/").users;
let Role = require("../models").roles;
let Role_module = require("../models").role_modules;
let Access_module = require("../models").access_modules;
let utils = require("../helpers/utils");
let modelHelper = require("../helpers/modelHelper");
let { StatusCodes } = require("http-status-codes");
module.exports = {
  checkRoleNameConflict: async (name) => {
    const count = await Role.count({ where: { title: name } });
    if (count) {
      return utils.responseGenerator(StatusCodes.CONFLICT, "Role name conflict");
    }
    return utils.responseGenerator(StatusCodes.OK, "No role name conflict");
  },
  async createRole(reqBody, user_id) {
    try {
      const { title, module_ids, status } = reqBody;
      const count = await Role.count({ where: { title: title /* createdBy: user_id */ } });
      if (count) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Role aleady exists");
      }
      const role = await Role.create({ title: title, status: status, createdBy: user_id });
      const role_id = role.id;
      const procesedModules_ids = module_ids.map((module_id) => {
        return { role_id, module_id, createdBy: user_id };
      });
      try {
        const roleModule = await Role_module.bulkCreate(procesedModules_ids);
      } catch (e) {
        await Role.destroy({ where: { id: role_id } });
        throw e;
      }
      return utils.responseGenerator(StatusCodes.OK, "Role created successfully", role);
    } catch (err) {
      throw err;
    }
  },
  async getAllMasterRoles(req) {
    try {
      const allRoles = await Role.findAll({
        where: {
          isMaster: true,
          title: { [db.Sequelize.Op.ne]: "Super Admin" },
        },
        include: [
          {
            model: Role_module,
            attributes: ["module_id"],
            include: { model: Access_module, attributes: ["id", "title", "description"] },
          },
        ],
      });
      //data formating
      let data = [];
      for (i in allRoles) {
        data.push(allRoles[i].dataValues);
        delete data[i].role_modules;
        data[i].access_modules = [];
        for (module of allRoles[i].role_modules) {
          data[i].access_modules.push(module.access_module.dataValues);
        }
      }
      return utils.responseGenerator(StatusCodes.OK, "All master roles fetched successfully", data);
    } catch (err) {
      throw err;
    }
  },
  async getMasterRole(id) {
    try {
      const role = await Role.findOne({
        where: { id: id, isMaster: true },
        include: [
          {
            model: Role_module,
            attributes: ["module_id"],
            include: { model: Access_module, attributes: ["id", "title", "description"] },
          },
        ],
      });
      if (!role) {
        return utils.responseGenerator(StatusCodes.NOT_FOUND, "Master role does not exist");
      }
      //data formating
      let data = role.dataValues;
      delete data.role_modules;
      data.access_modules = [];
      for (module of role.role_modules) {
        data.access_modules.push(module.access_module.dataValues);
      }

      return utils.responseGenerator(StatusCodes.OK, "Master role fetched successfully", data);
    } catch (err) {
      throw err;
    }
  },
  async getAllRoles(req, user_id) {
    try {
      //fitler
      const filter = {};
      req.query.status ? (filter.status = req.query.status) : null;
      //serach
      const searchBy = {};
      //pagging
      const { page_size, page_no = 1 } = req.query;
      const pagging = {};
      parseInt(page_size) ? (pagging.offset = parseInt(page_size) * (page_no - 1)) : null;
      parseInt(page_size) ? (pagging.limit = parseInt(page_size)) : null;
      const { count, rows: allRoles } = await Role.findAndCountAll({
        distinct: true,
        where: { ...filter, createdBy: user_id },
        include: [
          {
            model: Role_module,
            attributes: ["module_id"],
            include: { model: Access_module, attributes: ["id", "title", "description"] },
          },
        ],
        ...pagging,
      });
      //data formating
      let rows = [];
      for (i in allRoles) {
        rows.push(allRoles[i].dataValues);
        delete rows[i].role_modules;
        rows[i].access_modules = [];
        for (module of allRoles[i].role_modules) {
          module.access_module ? rows[i].access_modules.push(module.access_module) : null;
        }
      }
      return utils.responseGenerator(StatusCodes.OK, "All Role fetched successfully", { count, rows });
    } catch (err) {
      throw err;
    }
  },
  async getRole(param_id, user_id) {
    try {
      const role = await Role.findOne({
        where: { id: param_id, createdBy: user_id },
        include: [
          {
            model: Role_module,
            attributes: ["module_id"],
            include: { model: Access_module, attributes: ["id", "title", "description"] },
          },
        ],
      });
      if (!role) {
        return utils.responseGenerator(StatusCodes.NOT_FOUND, "Role does not exist");
      }
      //data formating
      let data = role.dataValues;
      delete data.role_modules;
      data.access_modules = [];
      for (module of role.role_modules) {
        module.access_module ? data.access_modules.push(module.access_module) : null;
      }
      return utils.responseGenerator(StatusCodes.OK, "Role fetched successfully", data);
    } catch (err) {
      throw err;
    }
  },

  async getUserRole(param_id) {
    try {
      const { id, role_id } = await User.findOne({
        where: { id: param_id },
      });

      return utils.responseGenerator(StatusCodes.OK, "Role fetched successfully", { userId: id, roleId: role_id });
    } catch (err) {
      throw err;
    }
  },

  async updateRole(param_id, reqBody, user_id) {
    try {
      const roleDetails = await Role.findOne({ where: { id: param_id, createdBy: user_id } });
      if (!roleDetails) {
        return utils.responseGenerator(StatusCodes.NOT_FOUND, "Role does not exist");
      }
      const { title, description, module_ids, status } = reqBody;

      roleDetails.title = title ? title : roleDetails.title;
      roleDetails.description = description ? description : roleDetails.description;
      roleDetails.status = status != undefined ? status : roleDetails.status;
      roleDetails.updatedBy = user_id;
      await roleDetails.save();
      if (module_ids) {
        const procesedModules_ids = module_ids.map((module_id) => {
          return { role_id: param_id, module_id, createdBy: user_id, updatedBy: user_id };
        });
        await Role_module.destroy({ where: { role_id: param_id } });
        await Role_module.bulkCreate(procesedModules_ids);
      }
      return utils.responseGenerator(StatusCodes.OK, "Role details updated successfully", roleDetails);
    } catch (err) {
      throw err;
    }
  },

  async deleteRole(param_id, user_id) {
    try {
      const roleDetails = await Role.findOne({ where: { id: param_id, createdBy: user_id } });
      if (!roleDetails) {
        return utils.responseGenerator(StatusCodes.NOT_FOUND, "Role does not exist", roleDetails);
      }
      await Role_module.destroy({ where: { role_id: param_id } });
      const result = await Role.destroy({
        where: {
          id: param_id,
        },
      });
      return utils.responseGenerator(StatusCodes.OK, "Role details deleted successfully", result);
    } catch (err) {
      throw err;
    }
  },
};
