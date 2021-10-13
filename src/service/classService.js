let User = require("../models").users;
let Teacher = require("../models").teachers;
let Class = require("../models").classes;
let Student = require("../models").students;
let Class_standard = require("../models").class_standards;
let Class_teacher = require("../models").class_teachers;
let Class_student = require("../models").class_students;
let ClassGroup = require("../models").class_groups;
let GroupStudents = require("../models").group_students;
let GroupColor = require("../models").group_colors;
let utils = require("../helpers/utils");
let modelHelper = require("../helpers/modelHelper");
let { sequelize } = require("../models/index");
let { classSettings } = require("../constants/setting");
let { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];
let classinvitationTemplateId = config.sendgrid.class_invitation_template_id;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
let SubscriptionPackage = require("../models/").subscription_packages;
let SubscribePackage = require("../models/").subscribe_packages;
let notificationService = require("../service/notificationService");

module.exports = {
  checkClassNameConflict: async (name) => {
    const count = await Class.count({ where: { title: name, deleted_at: null } });
    if (count) return utils.responseGenerator(StatusCodes.CONFLICT, "Class name conflict");
    return utils.responseGenerator(StatusCodes.OK, "No class name conflict");
  },
  createClass: async (reqBody, user_id) => {
    const t = await sequelize.transaction();
    try {
      reqBody.createdBy = user_id;
      reqBody.updatedBy = user_id;
      reqBody.parentId = reqBody.parent_id;
      reqBody.access_code = utils.randomString(6);
      const count = await Class.count({ where: { title: reqBody.title, deleted_at: null } });
      if (count) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Class already exists");
      const savedClass = await Class.create(
        {
          ...reqBody,
        },
        { transaction: t }
      );


      const processedClassStandards = reqBody.assigned_standard_ids.map((standard_id) => {
        return { class_id: savedClass.id, standard_id, createdBy: user_id, updatedBy: user_id };
      });
      const classStandards = await Class_standard.bulkCreate(processedClassStandards, { transaction: t });
      const processedClassTeachers = reqBody.assigned_teacher_ids.map((teacher_id) => {
        return { class_id: savedClass.id, teacher_id, createdBy: user_id, updatedBy: user_id };
      });
      const classTeachers = await Class_teacher.bulkCreate(processedClassTeachers, { transaction: t });
      const processedClassStudents = reqBody.assigned_student_ids.map((student_id) => {
        return { class_id: savedClass.id, student_id, createdBy: user_id, updatedBy: user_id };
      });
      //const classTeachers = await Class_teacher.bulkCreate(processedClassTeachers);
      const classStudents = await Class_student.bulkCreate(processedClassStudents, { transaction: t });

      await modelHelper.addSettings(savedClass.id, null, classSettings, t);
    
      const teacherEmailIds = (
        await User.findAll({
          attributes: ["email"],
          include: [
            {
              model: Teacher,
              required: true,
              where: { id: [...reqBody.assigned_teacher_ids] },
            },
          ],
        })
      ).map((teacher) => {
        return teacher.email;
      });

    
      await t.commit();


      // need to be changed for invitation email
      let templateData = {
        class_name: savedClass.title,
        access_code: savedClass.access_code,
      };
      // send email non blocking
      utils.sendEmail(teacherEmailIds, classinvitationTemplateId, templateData);
      return utils.responseGenerator(StatusCodes.OK, "Class created ", {
        id: savedClass.id,
        ...reqBody,
      });
    } catch (err) {
      console.log(err);
      await t.rollback();
      throw err;
    }
  },



  getClassesBySchool: async (param_id, user_id) => {
    try {
      //filter
      const filter = { deleted_at: null, status: true };
      if (!param_id) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "School id missing");
      else filter.school_id = param_id;

      //order by
      const rows = await Class.findAll({
        where: filter,
        attributes: ["id", "title", "district_id", "school_id", "status", "created_by"],
        order: [["id", "DESC"]],
      });
      const processedRows = rows

      return utils.responseGenerator(StatusCodes.OK, "Classes fetched", processedRows);
    } catch (err) {
      console.log(err);
      throw err;

    }
  },




  getAllClasses: async (req, user_id, isStudent) => {
    try {
      //filter
      const filter = { deleted_at: null };
      req.query.school_id ? (filter.school_id = req.query.school_id) : null;
      req.query.grade_id ? (filter.grade_id = req.query.grade_id) : null;
      req.query.status ? (filter.status = req.query.status) : null;
      if (req.query.archive === "1") filter.archived_at = { [Op.not]: null };
      else filter.archived_at = null;
      //serach
      const searchBy = {};
      req.query.search ? (searchBy.name = req.query.search) : null;

      //order by
      const order = [];
      const orderItem = req.query.sort_by == "grade" ? ["grade", "grade"] : ["id"];
      const sortOrder = req.query.sort_order;
      sortOrder == "desc" ? orderItem.push("DESC") : orderItem.push("ASC");
      order.push(orderItem);
      //pagging
      const { page_size, page_no = 1 } = req.query;
      const pagging = {};
      parseInt(page_size) ? (pagging.offset = parseInt(page_size) * (page_no - 1)) : null;
      parseInt(page_size) ? (pagging.limit = parseInt(page_size)) : null;
      //accessibleIds of this user
      if (isStudent)
        filter.id = (await Class_student.findAll({ where: { studentId: user_id } })).map((item) => item.classId);
      else {
        let accessId;
        const { entityId, entityType, isSubUser, parentId, rootParentId } = await modelHelper.entityDetails(user_id);
        if (entityType == "district" && !isSubUser) accessId = user_id;
        else if (entityType == "district" && isSubUser) accessId = parentId;
        else if (entityType == "school" && !isSubUser) {
          accessId = rootParentId ? rootParentId : user_id;
          rootParentId ? filter.school_id = entityId : null;
        }
        else if (entityType == "school" && isSubUser) {
          accessId = rootParentId ? rootParentId : parentId;
          rootParentId ? filter.school_id = entityId : null;
        }
        else if (entityType == "teacher")
          filter.id = (await Class_teacher.findAll({ where: { teacher_id: entityId } })).map((item) => item.class_id);
        else accessId = user_id;

        if (!filter.id) {
          const ids = await modelHelper.accessibleIds(accessId);
          filter.createdBy = [accessId, ...ids];
        }
      }
      if (req.query.duration) {
        var today = new Date();
        var priorDate = new Date();
        if (req.query.duration == 'week') filter.createdAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 7)), today] };
        if (req.query.duration == 'month') filter.createdAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 30)), today] };
        if (req.query.duration == 'quarter') filter.createdAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 120)), today] };
        if (req.query.duration == 'year') filter.createdAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 365)), today] };
      }
      const { count, rows } = await Class.findAndCountAll({
        where: filter,
        distinct: true,
        attributes: { exclude: ["grade_id"] },
        include: [
          "grade",
          "school",
          {
            model: Class_standard,
            required: false,
            include: ["standard"],
          },
          {
            model: Class_teacher,
            required: false,
            include: ["teacher"],
          },
          {
            model: Class_student,
            required: false,
            include: [
              {
                model: Student,
                attributes: {
                  exclude: ["userName", "password", "token", "packageId"],
                },
              },
            ],
          },
        ],
        order: order,
        ...pagging,
      });
      const processedRows = rows
        .map((row) => {
          return {
            ...row.toJSON(),
            class_teachers: row.toJSON().class_teachers.map((item) => item.teacher),
          };
        })
        .map((row) => {
          return {
            ...row,
            class_standards: row.class_standards.map((item) => item.standard),
          };
        })
        .map((row) => {
          return {
            ...row,
            class_students: row.class_students.map((item) => item.student),
          };
        });
      return utils.responseGenerator(StatusCodes.OK, "Classes fetched", { count, rows: processedRows });
    } catch (err) {
      throw err;

    }
  },
  getClass: async (param_id, user_id, isStudent) => {
    try {
      const filter = { id: param_id, deleted_at: null };
      //accessibleIds of this user
      if (isStudent) {
        const count = await Class_student.count({ where: { studentId: user_id, classId: param_id } });
        if (!count) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Class does not exist");
      } else {
        let accessId;
        const { entityId, entityType, isSubUser, parentId, rootParentId } = await modelHelper.entityDetails(user_id);
        if (entityType == "district" && !isSubUser) accessId = user_id;
        else if (entityType == "district" && isSubUser) accessId = parentId;
        else if (entityType == "school" && !isSubUser) {
          accessId = rootParentId ? rootParentId : user_id;
          rootParentId ? filter.school_id = entityId : null;
        }
        else if (entityType == "school" && isSubUser) {
          accessId = rootParentId ? rootParentId : parentId;
          rootParentId ? filter.school_id = entityId : null;
        }
        else if (entityType == "teacher") {
          const count = await Class_teacher.count({ where: { teacher_id: entityId, class_id: param_id } });
          if (!count) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Class does not exist");
        } else accessId = user_id;
        if (entityType != "teacher") {
          const ids = await modelHelper.accessibleIds(accessId);
          filter.createdBy = [accessId, ...ids];
        }
      }
      const classDetails = await Class.findOne({
        where: filter,
        attributes: { exclude: ["grade_id"] },
        include: [
          "grade",
          "school",
          {
            model: Class_standard,
            required: false,
            include: ["standard"],
          },
          {
            model: Class_teacher,
            required: false,
            include: ["teacher"],
          },
          {
            model: Class_student,
            required: false,
            include: [
              {
                model: Student,
                attributes: {
                  exclude: ["userName", "password", "token", "packageId"],
                },
                include: [
                  "relation",
                  {
                    model: GroupStudents,
                    attributes: ["id", "classId", "classGroupId", "studentId"],
                    as: "groupStudents",
                    include: [
                      {
                        model: ClassGroup,
                        attributes: ["id", "title", "classId", "groupColorId"],
                        as: "classGroup",
                        include: [
                          {
                            model: GroupColor,
                            attributes: ["id", "colorName", "hexCode"],
                            as: "groupColor"
                          },
                        ]
                      },
                    ]
                  }
                ],
              },
            ],
          },
        ],
      });
      if (!classDetails) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Class does not exist");
      const processedRow = { ...classDetails.toJSON() };
      processedRow.class_teachers = processedRow.class_teachers.map((item) => item.teacher);
      processedRow.class_standards = processedRow.class_standards.map((item) => item.standard);
      processedRow.class_students = processedRow.class_students.map((item) => item.student);
      //finding class owner
      const { entityId, entityType, isSubUser, DB } = await modelHelper.entityDetails(classDetails.createdBy);
      const ownerDetails = await DB.findOne({ where: { id: entityId } });
      if (isSubUser || entityType == "teacher")
        processedRow.classOwner = { name: ownerDetails.first_name + " " + ownerDetails.last_name };
      else processedRow.classOwner = { name: ownerDetails.admin_account_name };
      return utils.responseGenerator(StatusCodes.OK, "Class fetched successfully", processedRow);
    } catch (err) {
      throw err;
    }
  },
  updateClass: async (reqBody, param_id, user_id) => {
    try {
      const filter = { id: param_id, deleted_at: null };
      //accessibleIds of this user
      let accessId;
      const { entityId, entityType, isSubUser, parentId, rootParentId } = await modelHelper.entityDetails(user_id);
      if (entityType == "district" && !isSubUser) accessId = user_id;
      else if (entityType == "district" && isSubUser) accessId = parentId;
      else if (entityType == "school" && !isSubUser) {
        accessId = rootParentId ? rootParentId : user_id;
        rootParentId ? filter.school_id = entityId : null;
      }
      else if (entityType == "school" && isSubUser) {
        accessId = rootParentId ? rootParentId : parentId;
        rootParentId ? filter.school_id = entityId : null;
      }
      else if (entityType == "teacher") {
        const count = await Class_teacher.count({
          where: { teacher_id: entityId, class_id: param_id },
        });
        if (!count) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Class does not exist");
      } else accessId = user_id;
      if (entityType != "teacher") {
        const ids = await modelHelper.accessibleIds(accessId);
        filter.createdBy = [accessId, ...ids];
      }
      const classDetails = await Class.findOne({
        where: filter,
      });
      if (!classDetails) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Class does not exist");
      }
      const {
        title,
        description,
        // grade, //removed grade by b
        assigned_teacher_ids,
        assigned_standard_ids,
        assigned_student_ids,
        number_of_students,
        status,
      } = reqBody;

      classDetails.title = title ? title : classDetails.title;
      classDetails.description = description ? description : classDetails.description;
      // classDetails.grade = grade ? grade : classDetails.grade;
      classDetails.grade_id = reqBody.grade_id;

      classDetails.number_of_students = number_of_students ? number_of_students : classDetails.number_of_students;
      classDetails.status = status != undefined ? status : classDetails.status;
      await classDetails.save();
      if (assigned_standard_ids) {
        const processedClassStandards = reqBody.assigned_standard_ids.map((standard_id) => {
          return { class_id: classDetails.id, standard_id, createdBy: user_id, updatedBy: user_id };
        });
        await Class_standard.destroy({ where: { class_id: param_id } });
        await Class_standard.bulkCreate(processedClassStandards);
      }
      if (assigned_teacher_ids) {
        const processedClassTeachers = reqBody.assigned_teacher_ids.map((teacher_id) => {
          return { class_id: classDetails.id, teacher_id, createdBy: user_id, updatedBy: user_id };
        });
        await Class_teacher.destroy({ where: { class_id: param_id } });
        await Class_teacher.bulkCreate(processedClassTeachers);
      }
      if (assigned_student_ids) {
        const processedClassStudents = reqBody.assigned_student_ids.map((student_id) => {
          return { class_id: classDetails.id, student_id, createdBy: user_id, updatedBy: user_id };
        });
        await Class_student.destroy({ where: { class_id: param_id } });
        await Class_student.bulkCreate(processedClassStudents);
      }

      return utils.responseGenerator(StatusCodes.OK, "Class details updated successfully", {
        ...classDetails.toJSON(),
        ...reqBody,
      });
    } catch (err) {
      throw err;
    }
  },

  archiveClass: async (param_id, user_id) => {
    try {
      const classDetails = await Class.findOne({
        where: { id: param_id, deleted_at: null },
      });
      if (!classDetails) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Class does not exist");
      }
      const body = { archived_at: new Date(), updatedBy: user_id };
      const result = await Class.update(body, {
        where: {
          id: param_id,
        },
      });
      return utils.responseGenerator(StatusCodes.OK, "Class archieved successfully", {
        result,
      });
    } catch (err) {
      throw err;
    }
  },
  unArchiveClass: async (param_id, user_id) => {
    try {
      const classDetails = await Class.findOne({
        where: { id: param_id, deleted_at: null },
      });
      if (!classDetails) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Class does not exist");
      }
      const body = { archived_at: null, updatedBy: user_id };
      const result = await Class.update(body, {
        where: {
          id: param_id,
        },
      });
      return utils.responseGenerator(StatusCodes.OK, "Class unarchieved successfully", {
        result,
      });
    } catch (err) {
      throw err;
    }
  },
  deleteClass: async (param_id, user_id) => {
    try {
      const classDetails = await Class.findOne({
        where: { id: param_id, deleted_at: null },
      });
      if (!classDetails) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Class does not exist");
      }
      const body = { deleted_at: new Date(), updatedBy: user_id };
      const result = await Class.update(body, {
        where: {
          id: param_id,
        },
      });
      return utils.responseGenerator(StatusCodes.OK, "Class details deleted successfully", {
        result,
      });
    } catch (err) {
      throw err;
    }
  },

  joinClass: async (reqBody, user_id) => {
    const t = await sequelize.transaction();
    try {
      // reqBody.createdBy = user_id;
      // reqBody.updatedBy = user_id;
      const classDetail = await Class.findOne({
        attributes: {
          exclude: ["createdBy", "updatedBy", "createdAt", "updatedAt"],
        },
        where: { access_code: reqBody.accessCode, deleted_at: null },
      });

      if (!classDetail) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Class not exist");

      const classId = classDetail.dataValues.id;

      const classTeachers = await Class_teacher.create(
        {
          class_id: classId,
          teacher_id: reqBody.teacherId,
          createdBy: user_id,
          updatedBy: user_id,
        },
        { transaction: t }
      );

      await modelHelper.addSettings(classId, null, classSettings, t);
      await t.commit();
      const teacherEmailId = await User.findOne({
        attributes: ["email"],
        include: [
          {
            model: Teacher,
            required: true,
            where: { id: reqBody.teacherId },
          },
        ],
      });

      // need to be changed for invitation email
      let templateData = {
        class_name: classDetail.dataValues.title,
        access_code: reqBody.accessCode,
      };
      // // send email non blocking
      utils.sendEmail(teacherEmailId.email, classinvitationTemplateId, templateData);
      return utils.responseGenerator(StatusCodes.OK, "You have successfully joined class ", {
        id: classDetail.id,
        classDetail,
      });
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  getClassCount: async (id, roleId, packageId) => {
    try {
      let maxUserCount;
      const count = await Class.count({
        where: {
          parentId: id,
          deleted_at: null,
        },
      });

      let subscribePackageDetails = await SubscribePackage.findOne({
        where: {
          entityId: id,
          roleId: roleId,
          isActive: true,
        },
        include: [
          {
            model: SubscriptionPackage,
          },
        ],
      });

      let selectedPackageDetails = await SubscriptionPackage.findOne({
        where: {
          id: packageId,
        },
      });
      if (subscribePackageDetails) {
        maxUserCount = subscribePackageDetails.dataValues.subscription_package.dataValues.maxUser;
      }

      return utils.responseGenerator(StatusCodes.OK, `Classes:${count} and maxUserCount:${maxUserCount}`, {
        count: count,
        maxUserCount: count,
        selectedPackageMaxUserCount: selectedPackageDetails.maxUser,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  getAllDeletedClasses: async (req) => {
    try {
      //filter
      const filter = {};
      filter.deleted_at != null;
      req.query.school_id ? (filter.school_id = req.query.school_id) : null;


      if (req.query.duration) {
        var today = new Date();
        var priorDate = new Date();
        if (req.query.duration == 'week') filter.createdAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 7)), today] };
        if (req.query.duration == 'month') filter.createdAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 30)), today] };
        if (req.query.duration == 'quarter') filter.createdAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 120)), today] };
        if (req.query.duration == 'year') filter.createdAt = { [Op.between]: [new Date(priorDate.setDate(priorDate.getDate() - 365)), today] };
      }
      const { count, rows } = await Class.findAndCountAll({
        where: filter,
        distinct: true
      });
      return utils.responseGenerator(StatusCodes.OK, "Deleted Classes fetched", { count, rows: rows });
    } catch (err) {
      throw err;

    }
  }
};
