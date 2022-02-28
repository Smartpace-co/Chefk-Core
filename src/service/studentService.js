let Role = require("../models").roles;
let Student = require("../models").students;
let Class = require("../models").classes;
let Class_student = require("../models").class_students;
let Grade = require("../models").grades;
let School = require("../models").schools;
let District_admin = require("../models").district_admins;
let Relation = require("../models").relations;
let Allergen = require("../models").allergens;
let Student_allergen = require("../models").student_allergens;
let Medical_condition = require("../models").medical_conditions;
let Student_medical_condition = require("../models").student_medical_conditions;
let SubscribePackage = require("../models").subscribe_packages;
let SubscriptionPackage = require("../models").subscription_packages;
let notificationService = require("../service/notificationService");
let { studentSettings } = require("../constants/setting");
const { Op } = require("sequelize");
const { sequelize } = require("../models/index");
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
const file_upload_location = config.file_upload_location;
const generatePasswordPath = config.generate_password_path;
const generatePasswordTemplateId = config.sendgrid.generate_password_template_id;
let User = require("../models").users;
let generalTemplateId = config.sendgrid.general_template_id;
let DistrictAdmin = require("../models").district_admins;

//////////////////////////////// FUNCTIONS
async function createSt(reqBody, t) {
  try {
    let data;
    // add roleId if not available
    !reqBody.roleId ? (reqBody.roleId = (await Role.findOne({ where: { title: "student" } })).id) : null;

    const password = utils.randomString(10);
    const customer = await stripeHelper.createCustomer(reqBody.contactPersonEmail, reqBody.firstName);
    const student = await Student.create(
      {
        ...reqBody,
        parentId: reqBody.parentId,
        password: await utils.bcryptPassword(password),
        customerId: customer.id,
      },
      { transaction: t }
    );

    let savedSubscribePackage = {};
    let accessToken = JWTHelper.getStudentAccessToken(student, student.password);
    if (!reqBody.parentId) {
      savedSubscribePackage = await SubscribePackage.create(
        {
          uuid: utils.getUUID("SP"),
          entityId: student.id,
          roleId: reqBody.roleId, // change by ps
          packageId: reqBody.packageId, // chnage by ps
          // isOwner: true,
        },
        { transaction: t }
      );
      data = {
        ...student.toJSON(),
        password: undefined,
        subscribeId: savedSubscribePackage.id,
      };
      await Student.update(
        { token: accessToken, subscribeId: savedSubscribePackage.id },
        {
          where: {
            id: student.id,
          },
          transaction: t,
        }
      );
    } else {
      // const entityData = await modelHelper.entityParentCheck(reqBody.createdBy); // check parent id
      // if (entityData) {
      //   reqBody.parentId = entityData.id;
      // }

      const subscribePackageDetails = await SubscribePackage.findOne({
        where: { entityId: reqBody.parentId },
      });
      data = {
        ...student.toJSON(),
        password: undefined,
        subscribeId: subscribePackageDetails.id,
      };
      await Student.update(
        { token: accessToken, subscribeId: subscribePackageDetails.id },
        {
          where: {
            id: student.id,
          },
          transaction: t,
        }
      );
    }

    let generatePasswordLink = `${generatePasswordPath}?token=${accessToken}`;
    let templateData = {
      generate_password_link: generatePasswordLink,
    };

    await modelHelper.addSettings(student.id, reqBody.roleId, studentSettings, t);
    utils.sendEmail(reqBody.contactPersonEmail, generatePasswordTemplateId, templateData);

    // add welcome notification
    await notificationService.createNotifications(student.id, reqBody.roleId, reqBody.createdBy, "new_account");
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
async function updateSt(reqBody, param_id, filter, t) {
  try {
    const student = await Student.update(reqBody, {
      where: { id: param_id, ...filter },
      transaction: t,
    });
    return student;
  } catch (err) {
    throw err;
  }
}

//////////////////////////////// MODULES
module.exports = {
  checkUserNameConflict: async (userName) => {
    const count = await Student.count({ where: { userName: userName } });
    if (count) {
      return utils.responseGenerator(StatusCodes.CONFLICT, "User name conflict");
    }
    return utils.responseGenerator(StatusCodes.OK, "No user name conflict");
  },
  createStudent: async (reqBody, user_id) => {
    const t = await sequelize.transaction();
    try {
      const { classIds, allergenIds, medicalConditionIds } = reqBody;
      reqBody.createdBy = user_id;
      reqBody.parentRoleId = reqBody.roleId ? reqBody.roleId : undefined;
      const data = await createSt(reqBody, t);
      if (classIds) {
        const processedClassIds = classIds.map((classId) => {
          return { studentId: data.id, classId, createdBy: user_id };
        });
        await Class_student.bulkCreate(processedClassIds, { transaction: t });

        // email and notify the students
        const clses = await Class.findAll({
          attributes: ["id", "title"],
          where: { id: classIds },
        });
        const roleId = (await Role.findOne({ where: { title: "Student" } })).id;

          for (cls of clses){
            let templateData = {
              subject: "Added to class",
              header: "You have been added to a class",
              content: `Class Name: ${cls.title}, Student Name:${data.firstName} ${data.lastName}`,
            };
            utils.sendEmail(data.contactPersonEmail, generalTemplateId, templateData);
            await notificationService.createNotifications(
              data.id,
              roleId,
              user_id,
              "added_to_class",
              { className: cls.title}
            );
          }
      }
      if (allergenIds) {
        const processedAllergenIds = allergenIds.map((allergenId) => {
          return { studentId: data.id, allergenId, createdBy: user_id };
        });
        await Student_allergen.bulkCreate(processedAllergenIds, { transaction: t });
      }
      if (medicalConditionIds) {
        const processedMedicalCondtionIds = medicalConditionIds.map((medicalConditionId) => {
          return {
            studentId: data.id,
            medicalConditionId,
            createdBy: user_id,
          };
        });
        await Student_medical_condition.bulkCreate(processedMedicalCondtionIds, { transaction: t });
      }
      await t.commit();
      return utils.responseGenerator(StatusCodes.OK, "Email send successfully", {
        ...data,
      });
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },
  createStudentFromFile: async (reqBody, user_id) => {
    try {
      const { districtId, schoolId, fileName, roleId} = reqBody;
      if (districtId) {
        const count = await District_admin.count({ where: { id: districtId } });
        if (!count) {
          return utils.responseGenerator(StatusCodes.BAD_REQUEST, "District does not exist");
        }
      }
      if (schoolId) {
        const count = await School.count({ where: { id: schoolId } });
        if (!count) {
          return utils.responseGenerator(StatusCodes.BAD_REQUEST, "School does not exist");
        }
      }
      //process file
      const filePath = file_upload_location + "/" + fileName;
      const { data, error } = fileParser.fileParser(filePath);
      if (error) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "File parsing failed", error, true);

      const result = {};
      result.success = [];
      result.failed = [];
      for (row of data) {
        const t = await sequelize.transaction();
        try {
          //validate row
          const {
            userName,
            firstName,
            lastName,
            dob,
            grade,
            // contactType,
            contactPersonEmail,
            contactPersonNumber,
            contactPersonName,
            contactPersonRelation,
            school,
            gender,
            status,
          } = row;
          if (
            !userName ||
            !firstName ||
            !lastName ||
            !dob ||
            !grade ||
            // !contactType ||
            !contactPersonEmail ||
            !contactPersonNumber ||
            !contactPersonName ||
            !contactPersonRelation ||
            !status
          )
            throw "missing info; requiredFeild: username, firstName, lastName, dob, grade, contactPersonEmail, contactPersonNumber, contactPersonName, contactPersonRelation, status; optionalFeilds: school, gender ";
          // const userNameConflict = await Student.count({
          //   where: { userName: user_name, email: { [Op.not]: contact_person_email } },
          // });
          // if (usserNameConflict) throw "user name already exist";
          const date = utils.excelDateToJSDate(dob);
          if (date == "Invalid Date") throw "invalid date";
          else row.dob = date;
          const gradeId = await Grade.findOne({ where: { grade: grade } });
          if (!gradeId) throw "invalid grade";
          else row.gradeId = gradeId.id;
          // if (contactType.toLowerCase() != "parent" && contactType.toLowerCase() != "guardian")
          //   throw "invalid contact_type";
          if (!utils.emailValidation(contactPersonEmail)) throw "invalid email";
          const formatedNumber = utils.phoneVerifierFormater(contactPersonNumber);
          if (!formatedNumber) throw "inavlid phone_number"; else row.contactPersonNumber = formatedNumber;
          const relation = await Relation.findOne({
            where: { title: contactPersonRelation, /* type: contactType */ },
          });
          if (!relation) throw "invalid relation";
          else row.contactPersonRelationId = relation.id;
          if (schoolId) row.schoolId = schoolId;
          else if (school) {
            const schoolDetails = await School.findOne({
              where: { name: school, district_id: districtId },
            });
            if (schoolDetails) row.schoolId = schoolDetails.id;
            else throw "school does not exist";
          }
          if (!gender) {
          } else if (gender.toLowerCase() != "male" && gender.toLowerCase() != "female") throw "invalid gender";
          if (status.toLowerCase() != "active" && status.toLowerCase() != "inactive") throw "invalid status";
          status.toLowerCase() == "active" ? (row.status = true) : (row.status = false); // finetunning status
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
          const createdBy = [accessId, ...ids];
          districtId ? (filter.districtId = districtId) : null;
          schoolId ? (filter.schoolId = schoolId) : null;
          // check if row exists and is accessible
          const student = await Student.findOne({
            where: { userName: userName },
            attributes: { exclude: ["password", "token"] },
          });
          // update if exists, create if not
          if (student) {
            if (!createdBy.includes(student.createdBy)) throw "forbidden access to this student";
            else {
              row.updatedBy = user_id;
              const data = await updateSt(row, student.id, {}, t);
              await t.commit();
              result.success.push({ status: "upated", row });
            }
          } else {
            row.createdBy = user_id;
            districtId ? (row.districtId = districtId) : null;
            row.parentId=reqBody.parentId;
            const data = await createSt(row, t);
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
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Resulted in error", {
          ...result,
        });
      }
      return utils.responseGenerator(StatusCodes.OK, "All created successfully", {
        ...result,
      });
    } catch (err) {
      throw err;
    }
  },
  getAllStudents: async (req, user_id) => {
    try { 
      //fitler
      const filter = {};
      req.query.school_id ? (filter.schoolId = req.query.school_id) : null;
      req.query.existInSchool === "false" ? filter.school_id = null : null; 
      req.query.status ? (filter.status = req.query.status) : null;
      //serach
      const searchBy = {};
      if (req.query.search) {
        if (isNaN(req.query.search)) {
          // added by ps
          if (req.query.search.includes("@")) {
            // added by ps
            searchBy.contactPersonEmail = req.query.search; // added by ps
          } else {
            // added by ps
            const name = req.query.search.split(" ");
            name[0] ? (searchBy.first_name = name[0]) : null;
            name[1] ? (searchBy.last_name = name[1]) : null;
          }
        } else {
          // added by ps
          searchBy.id = req.query.search; // added by ps
        } // added by ps
      }

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
      if (req.user.isStudent) return utils.responseGenerator(StatusCodes.UNAUTHORIZED, "Unathorized Access");
      //accessibleIds of this user
      const { entityId, entityType, isSubUser, parentId, parentEntityId, rootParentId } = await modelHelper.entityDetails(user_id);
      if (entityType == "district" && !isSubUser) filter.districtId = entityId;
      else if (entityType == "district" && isSubUser) filter.districtId = parentEntityId;
      else if (entityType == "school" && !isSubUser) filter.schoolId =  entityId; 
      else if (entityType == "school" && isSubUser) filter.schoolId =  parentEntityId;
      else {
      const ids = await modelHelper.accessibleIds(user_id);
      filter.createdBy = [user_id, ...ids];
      }
      if (req.query.duration) {
        var today = new Date();
        var priorDate = new Date();
        if (req.query.duration == "week")
          filter.createdAt = {
            [Op.between]: [
              new Date(priorDate.setDate(priorDate.getDate() - 7)),
              today,
            ],
          };
        if (req.query.duration == "month")
          filter.createdAt = {
            [Op.between]: [
              new Date(priorDate.setDate(priorDate.getDate() - 30)),
              today,
            ],
          };
        if (req.query.duration == "quarter")
          filter.createdAt = {
            [Op.between]: [
              new Date(priorDate.setDate(priorDate.getDate() - 120)),
              today,
            ],
          };
        if (req.query.duration == "year")
          filter.createdAt = {
            [Op.between]: [
              new Date(priorDate.setDate(priorDate.getDate() - 365)),
              today,
            ],
          };
      }
      const { count, rows } = await Student.findAndCountAll({
        where: { ...filter, ...searchBy },
        distinct: true,
        attributes: {
          exclude: [
            "userName",
            "password",
            "token",
            "gradeId",
            "grade_id",
            "ethnicityId",
            "ethnicity_id",
            "contactPersonRelationId",
            "contact_person_relation_id",
          ],
        },
        include: [
          "grade",
          "ethnicity",
          "relation",
          {
            association: "allergens",
            attributes: ["id"],
            required: false,
            include: "allergen",
          },
        ],
        order: order,
        ...pagging,
      });
      return utils.responseGenerator(StatusCodes.OK, "Students fetched", {
        count,
        rows,
      });
    } catch (err) {
      throw err;
    }
  },
  getStudent: async (param_id, user_id, isStudent) => {
    try {
      const filter = { id: param_id };
      const exclude = [
        "password",
        "token",
        "gradeId",
        "grade_id",
        "schoolId",
        "school_id",
        "ethnicityId",
        "ethnicity_id",
        "contactPersonRelationId",
        "contact_person_relation_id",
      ];
      if (isStudent) {
        if (param_id != user_id) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Student does not exist");
      } else {
        //accessibleIds of this user
        const { entityId, entityType, isSubUser, parentEntityId } = await modelHelper.entityDetails(user_id);
        if (entityType == "district" && !isSubUser) filter.districtId = entityId;
        else if (entityType == "district" && isSubUser) filter.districtId = parentEntityId;
        else if (entityType == "school" && !isSubUser) filter.schoolId = entityId;
        else if (entityType == "school" && isSubUser) filter.schoolId = parentEntityId;
        else if (entityType == "teacher") {
          const count = await Class.count({
            include: [
              { association: "class_teachers", required: true, where: { teacher_id: entityId } },
              { association: "class_students", required: true, where: { studentId: param_id } },
            ],
          });
          if (!count) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Student does not exist");
        } else {
          //accessibleIds of this user
          const ids = await modelHelper.accessibleIds(user_id);
          filter.createdBy = [user_id, ...ids];
        }
      }
      const student = await Student.findOne({
        where: filter,
        attributes: { exclude },
        include: ["grade", "school", "ethnicity", "relation"],
      });
      if (!student) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Student does not exist");

      const classes = await Class.findAll({
        attributes: ["id", "title", "description"],
        include: [
          {
            model: Class_student,
            required: true,
            where: { studentId: student.id },
            attributes: [],
          },
        ],
      });
      const allergens = await Allergen.findAll({
        attributes: ["id", "allergenTitle"],
        include: [
          {
            association: "student_allergens",
            required: true,
            where: { studentId: student.id },
            attributes: [],
          },
        ],
      });
      const medicalConditions = await Medical_condition.findAll({
        attributes: ["id", "title", "description"],
        include: [
          {
            model: Student_medical_condition,
            required: true,
            where: { studentId: student.id },
            attributes: [],
          },
        ],
      });
      const data = { ...student.toJSON(), classes, allergens, medicalConditions };
      return utils.responseGenerator(StatusCodes.OK, "Student fetched successfully", data);
    } catch (err) {
      throw err;
    }
  },

  updateStudent: async (reqBody, param_id, user_id, isStudent) => {
    const t = await sequelize.transaction();
    try {
      const { classIds, allergenIds, medicalConditionIds } = reqBody;
      const filter = {};
      const extaFields = {};
      if (isStudent) {
        if (param_id != user_id) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Student does not exist");
      } else {
        //accessibleIds of this user
        const { entityId, entityType, isSubUser, parentEntityId} = await modelHelper.entityDetails(user_id);
        if (entityType == "district" && !isSubUser) filter.districtId = entityId;
        else if (entityType == "district" && isSubUser) filter.districtId = parentEntityId;
        else if (entityType == "school" && !isSubUser) filter.schoolId = entityId;
        else if (entityType == "school" && isSubUser) filter.schoolId = parentEntityId;
        else if (entityType == "teacher") {
          const count = await Class.count({
            include: [
              { association: "class_teachers", required: true, where: { teacher_id: entityId } },
              { association: "class_students", required: true, where: { studentId: param_id } },
            ],
          });
          if (!count) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Student does not exist");
        } else {
          //accessibleIds of this user
          const ids = await modelHelper.accessibleIds(user_id);
          filter.createdBy = [user_id, ...ids];
        }
        reqBody.updatedBy = user_id;
        extaFields.createdBy = user_id;
        extaFields.updatedBy = user_id;
      }
      // fetch student id
      const details = await Student.findOne({
        attributes: { exclude: ["password", "token"] },
        where: { id: param_id, ...filter },
      });
      if (!details) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Student does not exist");
      const studentId = details.id;
      // update detailss
      const data = await updateSt(reqBody, param_id, filter, t);
      if (classIds) {
        const processedClassIds = classIds.map((classId) => {
          return { studentId, classId, ...extaFields };
        });
        const oldClsIds = (await Class_student.findAll({ where: { studentId: studentId } })).map(i => i.classId);
        const newClsIds = classIds.filter(id => !oldClsIds.includes(id));
        const newClses = await Class.findAll({ attributes: ["id", "title"], where: {id: newClsIds}});
        await Class_student.destroy({ where: { studentId }, transaction: t });
        await Class_student.bulkCreate(processedClassIds, { transaction: t });

        // email and notify the students
        const roleId = (await Role.findOne({ where: { title: "Student" } })).id;
          for (cls of newClses){
            let templateData = {
              subject: "Added to class",
              header: "You have been added to a class",
              content: `Class Name: ${cls.title}, Student Name:${details.firstName} ${details.lastName}`,
            };
            utils.sendEmail(details.contactPersonEmail, generalTemplateId, templateData);
            await notificationService.createNotifications(
              studentId,
              roleId,
              user_id,
              "added_to_class",
              { className: cls.title}
            );
          }
      }
      if (allergenIds) {
        const processedAllergens = allergenIds.map((allergenId) => {
          return { studentId, allergenId, ...extaFields };
        });
        await Student_allergen.destroy({ where: { studentId }, transaction: t });
        await Student_allergen.bulkCreate(processedAllergens, { transaction: t });
      }
      if (medicalConditionIds) {
        const processedMedicalCondtionIds = medicalConditionIds.map((medicalConditionId) => {
          return { studentId, medicalConditionId, ...extaFields };
        });
        await Student_medical_condition.destroy({
          where: { studentId },
          transaction: t,
        });
        await Student_medical_condition.bulkCreate(processedMedicalCondtionIds, { transaction: t });
      }
      await t.commit();
      return utils.responseGenerator(StatusCodes.OK, "Student details updated successfully", data);
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },
  getStudentsByClassId: async (req, param_id, user_id) => {
    try {
      //filter
      const filter = { class_id : param_id };
      const filter1 = {};

      req.query.status ? (filter1.status = req.query.status) : null;
      //order by
      const order = [];
      const orderItem = req.query.sort_by == "studentID" ? ["studentID", "studentID"] : ["student_id"];
      const sortOrder = req.query.sort_order;
      sortOrder == "desc" ? orderItem.push("DESC") : orderItem.push("ASC");
      order.push(orderItem);
      //serach
      const searchBy = {};
      req.query.search ? (searchBy.name = req.query.search) : null;
      //pagging
      const { page_size, page_no = 1 } = req.query;
      const pagging = {};
      parseInt(page_size) ? (pagging.offset = parseInt(page_size) * (page_no - 1)) : null;
      parseInt(page_size) ? (pagging.limit = parseInt(page_size)) : null;

      const { count, rows } = await Class_student.findAndCountAll({
        distinct: true,
        where: filter,
        include: [
          {
            model: Student,
            attributes: {
              exclude: [
                "gradeId",
                "grade_id",
                "ethnicityId",
                "ethnicity_id",
                "contactPersonRelationId",
                "contact_person_relation_id",
              ],
            },
            required: true,
            include: [
              "grade",
              "ethnicity",
              "relation",
              {
                association: "allergens",
                required: false,
                include: [
                  {
                    model: Allergen,
                  },
                ],
              },
            ],
            where: { ...filter1 },
          },
        ],
        order: order,
      });
      const data = [];
      const role = await Role.findOne({ where: { title: "student" } });
      for (i in rows) {
        data.push(rows[i].dataValues);
        data[i].role = role;
        delete data[i].role_id;
      }

      return utils.responseGenerator(StatusCodes.OK, "Students fetched", {
        count,
        rows: rows,
      });
    } catch (err) {
      throw err;
    }
  },
  getStudentCount: async (id, roleId, packageId) => {
    try {
      let selectedPackageMaxUser, activePackageMaxUser;

      let packageDetails = await SubscribePackage.findOne({
        where: {
          entityId: id,
          roleId: roleId,
          isActive: true,
        },
        include: [
          {
            model: SubscriptionPackage,
            attributes: ["id", "maxUser"],
          },
        ],
      });

      let activeStudents = await Student.count({
        where: {
          parentId: id,
        },
      });

      let selectedMaxUser = await SubscriptionPackage.findOne({
        where: {
          id: packageId,
          status: true,
        },
        attributes: ["id", "maxUser"],
      });

      if (selectedMaxUser) selectedPackageMaxUser = selectedMaxUser.toJSON().maxUser;
      if (packageDetails) activePackageMaxUser = packageDetails.toJSON().subscription_package.maxUser;
      return utils.responseGenerator(
        StatusCodes.OK,
        `Classes:${activeStudents} and maxUserCount:${activePackageMaxUser}`,
        {
          count: activeStudents,
          maxUserCount: activeStudents,
          selectedPackageMaxUserCount: selectedPackageMaxUser,
        }
      );
    } catch (err) {
      console.log(err);
    }
  },

  showContactInformationToStudent: async (id) => {
    let schoolDetails, studentData,studentDistrictData,studentIds,studentDistrictIds
    const entityDetails = await modelHelper.entityDetails(id);
    const userDetails= await User.findOne({
      where:{
        id:id
      }
    })

   
    if(entityDetails.entityType==='school')
    {
      schoolDetails=await School.findOne({
        where:{
          id:entityDetails.entityId
        }
      })

      studentData=await Student.findAll({
        where:{
          school_id:entityDetails.entityId
        }
      })

      studentIds = studentData.map(obj => obj.id);

    }

    if(entityDetails.entityType==='district')
    {
      districtDetails=await DistrictAdmin.findOne({
        where:{
          id:entityDetails.entityId
        }
      })

      studentDistrictData=await Student.findAll({
        where:{
          district_id:entityDetails.entityId
        }
      })
      studentDistrictIds = studentDistrictData.map(obj => obj.id);

    }
    

    let templateData;
    let roleId = (await Role.findOne({ where: { title: "Student" } })).id;
    const { isEnable } = await modelHelper.getSetting(id, false, "dataPrivacyShowContactInformationStudent");
    let isSchoolEnable = await modelHelper.getSetting(id, false, "notiReceiveAllNotificationsAsEmails");


        if (isEnable && entityDetails.entityType==='school') {
            await notificationService.createNotifications(
              studentIds,
              roleId,
              id,
              "show_contact_information_to_student",
              { name: schoolDetails.name,contactPersonEmail:schoolDetails.contact_person_email,contactPersonNumber:schoolDetails.contact_person_number}
            );   
            templateData = {
              subject: "Notification",
              header: "Contact Information",
              content: `Contact Information are school:${schoolDetails.name},contact person email:${schoolDetails.contact_person_email},contact person number:${schoolDetails.contact_person_number}.`,
            };    
        }
        else if (isEnable && entityDetails.entityType==='district') {
          await notificationService.createNotifications(
            studentDistrictIds,
            roleId,
            id,
            "show_contact_information_to_student",
            {name: districtDetails.name,contactPersonEmail:districtDetails.contact_person_email,contactPersonNumber:districtDetails.contact_person_no}
          );    
          templateData = {
            subject: "Notification",
            header: "Contact Information",
            content: `Contact Information are district name:${districtDetails.name},contact person email:${districtDetails.contact_person_email},contact person number:${districtDetails.contact_person_no}.`,
          };   
      }


            if (isSchoolEnable.isEnable) {
              utils.sendEmail(userDetails.email, generalTemplateId, templateData);
            }
        return utils.responseGenerator(
          StatusCodes.OK,
          "Notications sent successfully"
        );
      }
};
