let User = require("../models/").users;
let Role = require("../models/").roles;
let District = require("../models/").district_admins;
let DistrictUser = require("../models/").district_users;
let School = require("../models/").schools;
let SchoolUser = require("../models/").school_users;
let Teacher = require("../models/").teachers;
let Setting = require("../models/").settings;
const { Op } = require("sequelize");

// this fucntion is outside for scope
async function entityDetails(userId) {
  try {
    const user = await User.findOne({
      where: { id: userId },
    });
    const loggedUserRole = user.role_id;
    let loggedUserRoleDetail = await Role.findOne({ where: { id: loggedUserRole } });
    const data = { userId };
    if (loggedUserRoleDetail && loggedUserRoleDetail.title != "Super Admin") {
      data.roleId = user.parent_role_id ? user.parent_role_id : user.role_id;
      data.isSubUser = user.parent_role_id ? true : false;
      const { title } = await Role.findOne({ where: { id: data.roleId } });
      let DB;
      data.entityType = title.toLowerCase();
      if (data.entityType == "district") DB = data.isSubUser ? DistrictUser : District;
      else if (data.entityType == "school") DB = data.isSubUser ? SchoolUser : School;
      else if (data.entityType == "teacher") DB = Teacher;
      else return undefined;
      data.DB = DB;
      const entityDetails = await DB.findOne({ where: { user_id: userId } });
      data.entityId = entityDetails.id;
      if (data.entityType == "district" && data.isSubUser) {
        data.parentId = user.createdBy;
        data.parentEntityId = entityDetails.district_id;
      }
      if (data.entityType == "school" && data.isSubUser) {
        data.parentId = user.createdBy;
        data.parentEntityId = entityDetails.school_id;
      }
      data.rootParentId = entityDetails.parentId;
    } else data.entityType = loggedUserRoleDetail.title.toLowerCase();

    return data;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  entityDetails,
  accessibleIds: async function (userIds) {
    try {
      userIds = Array.isArray(userIds) ? userIds : [userIds];
      const users = await User.findAll({
        where: { createdBy: userIds },
        attributes: ["id"],
      });
      let accessibleIds = [];
      let ids = users.map((e) => e.id);
      if (ids.length) accessibleIds = accessibleIds.concat(ids, await this.accessibleIds(ids));
      return accessibleIds;
    } catch (err) {
      throw err;
    }
  },
  addSettings: async (entityId, roleId, settings, t) => {
    try {
      const dataArray = settings.map((setting) => {
        return { entityId, roleId, ...setting };
      });
      const result = await Setting.bulkCreate(dataArray, { transaction: t });
      return result;
    } catch (err) {
      throw err;
    }
  },
  getSetting: async (userId, isStudent, key) => {
    try {
      let entityId;
      let roleId;
      if (isStudent) {
        entityId = userId;
        roleId = (await Role.findOne({ where: { title: "Student" } })).id;
      } else {
        const details = await entityDetails(userId);
        entityId = details.entityId;
        roleId = details.roleId; // Note: for district user and school user roleId is their parent role id
      }
      let data = await Setting.findOne({ where: { entityId, roleId, key } });
      return data;
    } catch (err) {
      throw err;
    }
  },
};
