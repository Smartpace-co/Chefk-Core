let User = require("../models").users;
let DistrictAdmin = require("../models").district_admins;
let School = require("../models").schools;
let Teacher = require("../models").teachers;
let Class = require("../models").classes;
let Class_student = require("../models").class_students;
let Student = require("../models").students;
let SubscribePackage = require("../models").subscribe_packages;
let Role = require("../models").roles;
let ClassGroup = require("../models").class_groups;
let GroupStudents = require("../models").group_students;
let GroupColor = require("../models").group_colors;
let { sequelize } = require("../models/index");
let { teacherSettings } = require("../constants/setting");
const fs = require("fs");
let JWTHelper = require("../helpers/jwtHelper");
let utils = require("../helpers/utils");
let stripeHelper = require("../helpers/stripeHelper");
let modelHelper = require("../helpers/modelHelper");
let fileParser = require("../helpers/fileParser");
let { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];
const resetPasswordPath = config.reset_password_path;
let resetPasswordTemplateId = config.sendgrid.reset_password_template_id;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
let notificationService = require("../service/notificationService");

//////////////////////////////// FUNCTIONS
async function createTr(reqBody, t) {
  try {
    const { parent_id } = reqBody;
    let data;
    const password = utils.randomString(10);
    const customer = await stripeHelper.createCustomer(
      reqBody.email,
      reqBody.first_name
    );

    const savedUser = await User.create(
      {
        ...reqBody,
        password: await utils.bcryptPassword(password),
      },
      { transaction: t }
    );
    const savedTeacher = await Teacher.create(
      {
        ...reqBody,
        parentId: parent_id,
        user_id: savedUser.id,
        customerId: customer.id
      },
      { transaction: t }
    );
    let accessToken = JWTHelper.getAccessToken(savedUser, savedUser.password);

    let savedSubscribePackage = {};
    if (!parent_id) {
      savedSubscribePackage = await SubscribePackage.create({
        uuid: await utils.getUUID("SP"),
        entityId: savedTeacher.user_id,
        roleId: reqBody.role_id,
        packageId: reqBody.package_id,
        // isOwner: true,
      },
        { transaction: t }
      );
      await User.update(
        { token: accessToken },
        {
          where: {
            id: savedUser.id,
          },
          transaction: t,
        }
      );
      await Teacher.update(
        {
          subscribeId: savedSubscribePackage.id,
        },
        {
          where: { id: savedTeacher.id },
          transaction: t,
        }
      );
      data = {
        ...savedUser.dataValues,
        teacher: savedTeacher.dataValues,
        subscribeId: savedSubscribePackage.id,
        password: undefined,
      };
    } else {
      const subscribePackageDetails = await SubscribePackage.findOne({
        where: { entityId: parent_id }
      });
      data = {
        ...savedUser.dataValues,
        teacher: savedTeacher.dataValues,
        subscribeId: subscribePackageDetails.dataValues.id,
        password: undefined,
      };
    }

    let resetPasswordLink = `${resetPasswordPath}?token=${accessToken}`;
    let templateData = {
      reset_link: resetPasswordLink,
    };

    utils.sendEmail(reqBody.email, resetPasswordTemplateId, templateData);
  
    return data;
  } catch (err) {
    throw err;
  }
}
async function updateTr(reqBody, param_id, filter1 = {}, filter2 = {}) {
  try {
    const user = await User.update(reqBody, {
      where: { id: param_id, ...filter1 },
    });
    const teacher = await Teacher.update(reqBody, {
      where: { user_id: param_id, ...filter2 },
    });
    const data = {
      user: user[0],
      teacher: teacher[0],
    };
    return data;
  } catch (err) {
    throw err;
  }
}

//////////////////////////////// MODULES
module.exports = {

  createTeacher: async (reqBody, user_id) => {
    const t = await sequelize.transaction();
    try {
      const { district_id, school_id, name, role_id } = reqBody;
      if (district_id) {
        const count = await DistrictAdmin.count({ where: { id: district_id } });
        if (!count) {
          return utils.responseGenerator(
            StatusCodes.BAD_REQUEST,
            "District does not exist"
          );
        }
      }
      if (school_id) {
        const count = await School.count({ where: { id: school_id } });
        if (!count) {
          return utils.responseGenerator(
            StatusCodes.BAD_REQUEST,
            "School does not exist"
          );
        }
      }
      reqBody.createdBy = user_id;
      reqBody.updatedBy = user_id;
      const data = await createTr(reqBody, t);
      await modelHelper.addSettings(
        data.teacher.id,
        role_id,
        teacherSettings,
        t
      );
      await t.commit();
      return utils.responseGenerator(
        StatusCodes.OK,
        "Email send successfully",
        {
          ...data,
        }
      );
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },
  createTeacherFromFile: async (reqBody, user_id) => {
    try {
      const { district_id, school_id, name, role_id,parent_id } = reqBody;
      if (district_id) {
        const count = await DistrictAdmin.count({ where: { id: district_id } });
        if (!count) {
          return utils.responseGenerator(
            StatusCodes.BAD_REQUEST,
            "District does not exist"
          );
        }
      }
      if (school_id) {
        const count = await School.count({
          where: { id: school_id, district_id: district_id },
        });
        if (!count) {
          return utils.responseGenerator(
            StatusCodes.BAD_REQUEST,
            "School does not exist"
          );
        }
      }
      //process file
      const filePath =
        process.env.FILE_UPLOAD_LOCATION + "/" + reqBody.file_name;
      const { data, error } = fileParser.fileParser(filePath);
      if (error)
        return utils.responseGenerator(
          StatusCodes.BAD_REQUEST,
          "File parsing failed",
          error,
          true
        );

      const result = {};
      result.success = [];
      result.failed = [];
      for (row of data) {
        const t = await sequelize.transaction();
        try {
          //validate row
          const {
            first_name,
            last_name,
            email,
            phone_number,
            school,
            gender,
            status,
          } = row;
          if (
            !first_name ||
            !last_name ||
            !email ||
            !phone_number ||
            !gender ||
            !status
          )
            throw "missing info; requiredFeild:first_name, last_name, email, phone_number, gender, status; optionalFeilds: school ";
          if (!utils.emailValidation(email)) throw "invalid email";
          if (!parseInt(phone_number)) throw "inavlid phone_number";
          if (school) {
            const schoolDetails = await School.findOne({
              where: { name: school, district_id: district_id },
            });
            if (schoolDetails) row.school_id = schoolDetails.id;
            else throw "school does not exist";
          }
          if (
            gender.toLowerCase() != "male" &&
            gender.toLowerCase() != "female"
          )
            throw "invalid gender";
          if (
            status.toLowerCase() != "active" &&
            status.toLowerCase() != "inactive"
          )
            throw "invalid status";
          status.toLowerCase == "active"
            ? (row.status = true)
            : (row.status = false); // finetunning status
          const filter = {};
          //accessibleIds of this user
          let accessId;
          const { entityId, entityType, isSubUser, parentId } = await modelHelper.entityDetails(user_id);
          if (entityType == "district" && !isSubUser) accessId = user_id;
          else if (entityType == "district" && isSubUser) accessId = parentId;
          else if (entityType == "school" && !isSubUser) accessId = user_id;
          else if (entityType == "school" && isSubUser) accessId = parentId;
          else accessId = user_id;
          const ids = await modelHelper.accessibleIds(accessId);
          filter.createdBy = [accessId, ...ids];
          // check if row exists and is accessible
          const user = await User.findOne({
            where: { email: email },
            attributes: { exclude: ["password", "token"] },
            include: [
              {
                model: Teacher,
                required: false,
                where: { district_id: district_id, ...filter },
              },
            ],
          });
          // update if exists, create if not
          if (user) {
            if (!user.teacher) throw "forbidden access to this user";
            row.updatedBy = user_id;
            const data = await updateTr(row, user.id);
            result.success.push({ status: "upated", row });
          } else {
            row.createdBy = user_id;
            row.updatedBy = user_id;
            row.district_id = district_id;
            school_id ? (row.school_id = school_id) : null;
            row.role_id = role_id;
            row.parent_id=parent_id
            const data = await createTr(row, t);
            await modelHelper.addSettings(
              data.teacher.id,
              role_id,
              teacherSettings,
              t
            );
            await t.commit();
            result.success.push({ status: "created", row });
          }
        } catch (err) {
          await t.rollback();
          result.failed.push({ error: err.toString(), row });
        }
      }
      fs.unlinkSync(filePath);
      if (result.failed.length > 0) {
        return utils.responseGenerator(
          StatusCodes.BAD_REQUEST,
          "Resulted in error",
          {
            ...result,
          }
        );
      }
      return utils.responseGenerator(
        StatusCodes.OK,
        "All created successfully",
        {
          ...result,
        }
      );
    } catch (err) {
      throw err;
    }
  },
  getAllTeachers: async (req, user_id) => {
    try {
      //filter  
      const filter1 = {};
      req.query.status ? (filter1.status = req.query.status) : null;
      const filter2 = {};
      req.query.school_id ? (filter2.school_id = req.query.school_id) : null;

      if (req.query.duration) {
        var today = new Date();
        var priorDate = new Date();
        if (req.query.duration == "week")
          filter2.createdAt = {
            [Op.between]: [
              new Date(priorDate.setDate(priorDate.getDate() - 7)),
              today,
            ],
          };
        if (req.query.duration == "month")
        filter2.createdAt = {
            [Op.between]: [
              new Date(priorDate.setDate(priorDate.getDate() - 30)),
              today,
            ],
          };
        if (req.query.duration == "quarter")
        filter2.createdAt = {
            [Op.between]: [
              new Date(priorDate.setDate(priorDate.getDate() - 120)),
              today,
            ],
          };
        if (req.query.duration == "year")
        filter2.createdAt = {
            [Op.between]: [
              new Date(priorDate.setDate(priorDate.getDate() - 365)),
              today,
            ],
          };
      }
      
      //search
      const searchBy = {};
      if (req.query.search) {
        const name = req.query.search.split(" ");
        name[0] ? (searchBy.first_name = name[0]) : null;
        name[1] ? (searchBy.last_name = name[1]) : null;
      }
      //order by
      const order = [];
      const orderItem = req.query.sort_by == "teacherID" ? ["teacherID", "teacherID"] : ["id"];
      const sortOrder = req.query.sort_order;
      sortOrder == "desc" ? orderItem.push("DESC") : orderItem.push("ASC");
      order.push(orderItem);
      //pagging
      const { page_size, page_no = 1 } = req.query;
      const pagging = {};
      parseInt(page_size)
        ? (pagging.offset = parseInt(page_size) * (page_no - 1))
        : null;
      parseInt(page_size) ? (pagging.limit = parseInt(page_size)) : null;

      //accessibleIds of this user
      let accessId;
      const { entityId, entityType, isSubUser, parentId, rootParentId } = await modelHelper.entityDetails(user_id);
      if (entityType == "district" && !isSubUser) accessId = user_id;
      else if (entityType == "district" && isSubUser) accessId = parentId;
      else if (entityType == "school" && !isSubUser){
       accessId = rootParentId ? rootParentId: user_id;
       rootParentId ? filter2.school_id = entityId: null; 
      }
      else if (entityType == "school" && isSubUser){
       accessId = rootParentId? rootParentId: parentId;
       rootParentId ? filter2.school_id = entityId: null; 
      }
      else accessId = user_id;
      const ids = await modelHelper.accessibleIds(accessId);
      filter1.createdBy = [accessId, ...ids];
      
      const { count, rows } = await User.findAndCountAll({
        where: { ...filter1 },
        attributes: { exclude: ["password", "token"] },
        include: [
          {
            model: Teacher,
            required: true,
            where: { ...filter2, ...searchBy },
          },
        ],
        ...pagging,
        order: order

      });
      const data = [];
      const role = await Role.findOne({ where: { title: "teacher" } });
      for (i in rows) {
        data.push(rows[i].dataValues);
        data[i].role = role;
        delete data[i].role_id;
      }
      return utils.responseGenerator(StatusCodes.OK, "Schools fetched", {
        count,
        rows: data,
      });
    } catch (err) {
      throw err;
    }
  },
  getTeacher: async (param_id, user_id) => {
    try {
      const filter1 = {};
      const filter2 = {};
      if (param_id != user_id) {
        //accessibleIds of this user
        let accessId;
        const { entityId, entityType, isSubUser, parentId, rootParentId } = await modelHelper.entityDetails(user_id);
        if (entityType == "district" && !isSubUser) accessId = user_id;
        else if (entityType == "district" && isSubUser) accessId = parentId;
        else if (entityType == "school" && !isSubUser){
         accessId = rootParentId ? rootParentId: user_id;
         rootParentId ? filter2.school_id = entityId: null; 
        }
        else if (entityType == "school" && isSubUser){
         accessId = rootParentId? rootParentId: parentId;
         rootParentId ? filter2.school_id = entityId: null; 
        }
        else accessId = user_id;
        const ids = await modelHelper.accessibleIds(accessId);
        filter1.createdBy = [accessId, ...ids];
        filter1.id = param_id;
      } else {
        filter1.id = param_id;
      }
      const teacherDetails = await User.findOne({
        where: { ...filter1 },
        attributes: { exclude: ["password", "token"] },
        include: [
          {
            model: Teacher,
            required: true,
            attributes: { exclude: ["school_id"] },
            include: [{ model: School }],
            where: { ...filter2 },
          },
        ],
      });
      if (!teacherDetails)
        return utils.responseGenerator(
          StatusCodes.BAD_REQUEST,
          "Teacher does not exist"
        );

      const role = await Role.findOne({
        where: { id: teacherDetails.role_id },
      });
      // const school = await School.findOne({ where: { id: teacherDetails.teacher.school_id } });
      const data = { ...teacherDetails.dataValues, role_id: undefined, role };
      return utils.responseGenerator(
        StatusCodes.OK,
        "Teacher fetched successfully",
        data
      );
    } catch (err) {
      throw err;
    }
  },
  updateTeacher: async (reqBody, param_id, user_id) => {
    try {
      const filter1 = {};
      const filter2 = {};
      if (param_id != user_id) {
        //accessibleIds of this user
        let accessId;
        const { entityId, entityType, isSubUser, parentId, rootParentId } = await modelHelper.entityDetails(user_id);
        if (entityType == "district" && !isSubUser) accessId = user_id;
        else if (entityType == "district" && isSubUser) accessId = parentId;
        else if (entityType == "school" && !isSubUser){
         accessId = rootParentId ? rootParentId: user_id;
         rootParentId ? filter2.school_id = entityId: null; 
        }
        else if (entityType == "school" && isSubUser){
         accessId = rootParentId? rootParentId: parentId;
         rootParentId ? filter2.school_id = entityId: null; 
        }
        else accessId = user_id;
        const ids = await modelHelper.accessibleIds(accessId);
        filter1.createdBy = [accessId, ...ids];
      }
      reqBody.updatedBy = user_id;
      const data = await updateTr(reqBody, param_id, filter1, filter2);
      return utils.responseGenerator(
        StatusCodes.OK,
        "Teacher details updated successfully",
        data
      );
    } catch (err) {
      throw err;
    }
  },
 
  // below endpoints are used in teracher module only
  createGroup: async (reqBody, user_id) => {
    const t = await sequelize.transaction();
    try {
      const { studentIds } = reqBody;
      reqBody.createdBy = user_id;

      const ids = await modelHelper.accessibleIds(user_id);
      const classDetails = await Class.findOne({
        where: { id: reqBody.classId, deleted_at: null },
      });
      if (!classDetails) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Class does not exist");
      }
      const classGroup = await ClassGroup.create({ ...reqBody }, { transaction: t });

      let groupStudents = null;
      if (studentIds) {
        const processedstudentIds = studentIds.map((studentId) => {
          return {
            classId: reqBody.classId,
            classGroupId: classGroup.id,
            studentId: studentId,
            createdBy: user_id
          };
        });
        groupStudents = await GroupStudents.bulkCreate(processedstudentIds, { transaction: t });
      }

      await t.commit();

      const studentsEmailIds = (
        await Student.findAll({
          attributes: ["contactPersonEmail"],
          where: { id: [...reqBody.studentIds] },
        })
      ).map((student) => {
        return student.contactPersonEmail;
      });
      // need to be changed for invitation email
      let templateData = {
        group_name: classGroup.title,
      };

      // send email non blocking
      // utils.sendEmail(studentsEmailIds, classinvitationTemplateId, templateData);
      return utils.responseGenerator(StatusCodes.OK, "Email send successfully", {

      });
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  getGroupNames: async (param_id, user_id) => {
    try {
      //fitler
      const filter = {};
      param_id ? (filter.classId = param_id) : null;
      filter.deletedAt = null;
      // req.query.school_id ? (filter.schoolId = req.query.school_id) : null;
      // req.query.status ? (filter.status = req.query.status) : null;
      //serach

      //accessibleIds of this user
      const ids = await modelHelper.accessibleIds(user_id);

      let rows = await ClassGroup.findAll({
        attributes: ["id", "title", "classId", "groupColorId", "status"],
        where: {
          ...filter, createdBy: [user_id, ...ids]
        },
        include: [
          {
            model: GroupColor,
            attributes: ["id", "colorName", "hexCode"],
            as: "groupColor"
          },
        ],
        // ...pagging,
      });
      return utils.responseGenerator(StatusCodes.OK, "Groups list fetched", rows);
    } catch (err) {
      throw err;
    }
  },

  getGroupsByClass: async (req, user_id) => {
    try {
      //fitler
      const filter = {};
      req.params.id ? (filter.classId = req.params.id) : null;
      filter.deletedAt = null;
      // req.query.school_id ? (filter.schoolId = req.query.school_id) : null;
      // req.query.status ? (filter.status = req.query.status) : null;
      //serach

      //accessibleIds of this user
      const ids = await modelHelper.accessibleIds(user_id);

      let rows = await ClassGroup.findAll({
        attributes: ["id", "title", "classId", "groupColorId", "status", "createdBy", "updatedBy", "createdAt", "updatedAt"],
        where: {
          ...filter, createdBy: [user_id, ...ids]
        },

        include: [
          {
            model: GroupColor,
            attributes: ["id", "colorName", "hexCode"],
            as: "groupColor"
          },
          {
            model: GroupStudents,
            attributes: ["id", "studentId"],
            as: "groupStudents",
            include: [
              {
                model: Student,
                attributes: ["id", "firstName", "lastName"]
              }
            ]
          },

        ],
        // ...pagging,
      });

      rows.map(obj => {
        return obj.setDataValue('studentList', obj.groupStudents.map(obj => obj.student));
      });

      return utils.responseGenerator(StatusCodes.OK, "Groups list fetched", {
        rows
      });
    } catch (err) {
      throw err;
    }
  },

  editGroup: async (reqBody, param_id, user_id) => {
    const t = await sequelize.transaction();
    try {
      const { studentIds } = reqBody;
      reqBody.createdBy = user_id;
      reqBody.updatedBy = user_id;

      const ids = await modelHelper.accessibleIds(user_id);
      const groupDetails = await ClassGroup.findOne({
        where: { id: param_id, deletedAt: null },
      });
      if (!groupDetails) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Group does not exist");
      }

      const colorCheck = await ClassGroup.findOne({
        where: { id: { [Op.not]: param_id }, classId: reqBody.classId, groupColorId: reqBody.groupColorId, deletedAt: null },
      });
      if (colorCheck) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Group color already exist");

      const titleCheck = await ClassGroup.findOne({
        where: { id: { [Op.not]: param_id }, classId: reqBody.classId, title: reqBody.title, deletedAt: null },
      });
      if (titleCheck) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Group title already exist");

      const classGroup = await ClassGroup.update(reqBody, {
        where: { id: param_id, deletedAt: null },
        transaction: t
      });

      await GroupStudents.destroy({ where: { classGroupId: param_id }, transaction: t });

      let groupStudents = null;
      if (studentIds) {
        const processedstudentIds = studentIds.map((studentId) => {
          return {
            classId: groupDetails.classId,
            classGroupId: param_id,
            studentId: studentId,
            createdBy: user_id,
            updatedBy: user_id
          };
        });
        groupStudents = await GroupStudents.bulkCreate(processedstudentIds, { transaction: t });

      }

      await t.commit();

      const studentsEmailIds = (
        await Student.findAll({
          attributes: ["contactPersonEmail"],
          where: { id: [...reqBody.studentIds] },
        })
      ).map((student) => {
        return student.contactPersonEmail;
      });
      // need to be changed for invitation email
      let templateData = {
        group_name: classGroup.title,
      };
      // send email non blocking
      // utils.sendEmail(studentsEmailIds, classinvitationTemplateId, templateData);
      return utils.responseGenerator(StatusCodes.OK, "Group updated successfully", {

      });
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  deleteGroup: async (param_id, user_id) => {
    try {
      const t = await sequelize.transaction();

      const ids = await modelHelper.accessibleIds(user_id);
      const groupDetails = await ClassGroup.findOne({
        where: { id: param_id, createdBy: [user_id, ...ids], deletedAt: null },
      });
      if (!groupDetails) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Group does not exist");
      }
      await GroupStudents.destroy({ where: { classGroupId: param_id }, transaction: t });

      let result = await ClassGroup.update({ deletedAt: new Date(), updatedBy: user_id }, {
        where: { id: param_id },
        transaction: t
      });
      await t.commit();
      return utils.responseGenerator(StatusCodes.OK, "Group deleted successfully", {
        result
      });
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  checkColorAndTitleConflict: async (reqBody, user_id) => {
    try {
      const colorCheck = await ClassGroup.findOne({
        where: { groupColorId: reqBody.groupColorId, classId: reqBody.classId, deletedAt: null },
      });

      if (colorCheck) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Group color already exist");
      }

      const titleCheck = await ClassGroup.findOne({
        where: { title: reqBody.title, classId: reqBody.classId, deletedAt: null },
      });

      if (titleCheck) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Group title already exist");
      }

      return utils.responseGenerator(StatusCodes.OK, "No title or color conflict", {
      });

    } catch (err) {
      await t.rollback();
      throw err;
    }
  },


  getNonGroupStudents: async (req, param_id, user_id) => {
    try {
      let filter = {};
      if (req.query.groupId) filter = { classId: param_id, classGroupId: { [Op.ne]: req.query.groupId } };
      else filter = { classId: param_id };

      //accessibleIds of this user
      let studentData = await GroupStudents.findAll({
        where: { ...filter },
      });

      studentData = JSON.parse(JSON.stringify(studentData));
      let studentIds = studentData.map(obj => obj.student_id);

      let class_students = await Class_student.findAll({
        where: { class_id: param_id, student_id: { [Op.notIn]: studentIds } },
        include: [
          {
            model: Student,
            attributes: {
              exclude: ["userName", "password", "token", "packageId"],
            },
          },
        ],
      });

      class_students = JSON.parse(JSON.stringify(class_students));
      class_students = class_students.map((item) => item.student);

      return utils.responseGenerator(StatusCodes.OK, "Students List fetched successfully", { class_students });
    } catch (err) {
      throw err;
    }
  },


};
