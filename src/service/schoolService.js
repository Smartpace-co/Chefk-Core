let User = require("../models").users;
let DistrictAdmin = require("../models").district_admins;
let School = require("../models").schools;
let Role = require("../models").roles;
let SubscribePackage = require("../models").subscribe_packages;
let SubscriptionPackage = require("../models/").subscription_packages;
// let SubscriptionPackagePlan = require("../models/").subscription_package_plans;
let { sequelize } = require("../models/index");
let Sequelize = require("sequelize");
let Op = Sequelize.Op;
let { schoolSettings } = require("../constants/setting");
let JWTHelper = require("../helpers/jwtHelper");
let utils = require("../helpers/utils");
let stripeHelper = require("../helpers/stripeHelper");
let modelHelper = require("../helpers/modelHelper");
let { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];
const generatePasswordPath = config.generate_password_path;
const resetPasswordPath = config.reset_password_path;
const generatePasswordTemplateId = config.sendgrid.generate_password_template_id;
let resetPasswordTemplateId = config.sendgrid.reset_password_template_id;
const checkoutdPath = config.checkout_path;
const paymentRequestTemplateId = config.sendgrid.payment_request_template_id;
let Payment = require("../models").payments;
let ClasStudent = require("../models").class_students;
let Student = require("../models").students;
const Question = require("../models").questions;

const AssignLesson = require("../models").assign_lessons;
const StudentLessonAnswer = require("../models").student_lesson_answers;
const Lesson = require("../models").lessons;
const Class = require("../models").classes;
let notificationService = require("../service/notificationService");
let generalTemplateId = config.sendgrid.general_template_id;
let { UniqueConstraintError, ForeignKeyConstraintError } = require("sequelize");

module.exports = {
  checkSchoolNameConflict: async (name) => {
    const count = await School.count({ where: { name: name } });
    if (count) {
      return utils.responseGenerator(
        StatusCodes.CONFLICT,
        "School name conflict"
      );
    }
    return utils.responseGenerator(StatusCodes.OK, "No school name conflict");
  },
  createSchool: async (reqBody, user_id) => {
    let data;
    const t = await sequelize.transaction();
    try {
      const { district_id, role_id, parent_id, package_id } = reqBody;
      if (district_id) {
        const count = await DistrictAdmin.count({ where: { id: district_id } });
        if (!count) {
          return utils.responseGenerator(
            StatusCodes.BAD_REQUEST,
            "District do not exist"
          );
        }
      }
      reqBody.createdBy = user_id;
      reqBody.updatedBy = user_id;

      const password = utils.randomString(10);

      const customer = await stripeHelper.createCustomer(
        reqBody.email,
        reqBody.admin_account_name
      );

      const savedUser = await User.create(
        {
          ...reqBody,
          password: await utils.bcryptPassword(password),
        },
        { transaction: t }
      );

      const savedSchool = await School.create(
        {
          ...reqBody,
          parentId: parent_id,
          user_id: savedUser.id,
          customerId: customer.id,
        },
        { transaction: t }
      );
      let accessToken = JWTHelper.getAccessToken(savedUser, savedUser.password);
      if (!parent_id) {
        const savedSubscribePackage = await SubscribePackage.create(
          {
            uuid: await utils.getUUID("SP"),
            entityId: savedSchool.user_id,
            roleId: reqBody.role_id,
            packageId: package_id,
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

        await School.update(
          {
            subscribeId: savedSubscribePackage.id,
          },
          { where: { id: savedSchool.id }, transaction: t }
        );

        if (reqBody.isSendPaymentLink) {
          const packageDetails = await SubscriptionPackage.findOne({
            attributes: [
              "packageTitle",
              "packageFor",
              "price",
              "status",
              "priceId",
            ],
            where: { id: package_id },

            transaction: t,
          });
          const session = await stripeHelper.createSession(
            packageDetails,
            customer.id,
            savedSubscribePackage.id,
            packageDetails.priceId
          );

          await SubscribePackage.update(
            { sessionId: session.id },
            { where: { id: savedSubscribePackage.id }, transaction: t }
          );

          // let paymentRequestTemplateData = {
          //   checkout_link: session.url,
          // };
          // utils.sendEmail(
          //   reqBody.email,
          //   paymentRequestTemplateId,
          //   paymentRequestTemplateData
          // );
        }

        data = {
          ...savedUser.dataValues,
          ...savedSchool.dataValues,
          password: undefined,
          subscribeId: savedSubscribePackage.id,
        };

      } else {
        const subscribePackageDetails = await SubscribePackage.findOne({
          where: { entityId: parent_id },
        });
        data = {
          ...savedUser.dataValues,
          ...savedSchool.dataValues,
          password: undefined,
          subscribeId: subscribePackageDetails.dataValues.id,
        };
      }
      await modelHelper.addSettings(savedSchool.id, role_id, schoolSettings, t);
      await notificationService.createNotifications(
        savedUser.id,
        savedUser.role_id,
        user_id,
        "new_account",
      );
      await t.commit();
      let generatePasswordLink = `${generatePasswordPath}?token=${accessToken}`;
      let templateData = {
        generate_password_link: generatePasswordLink,
      };

      utils.sendEmail(reqBody.email, generatePasswordTemplateId, templateData);

      return utils.responseGenerator(
        StatusCodes.OK,
        "Email send successfully",
        {
          ...data,
        }
      );
    } catch (err) {
      await t.rollback();
      if (err instanceof UniqueConstraintError) {
        return utils.responseGenerator(
          StatusCodes.CONFLICT,
          "School already exist"
        );
      } 
      console.log("Error ==> ", err);
      throw err;
    }
  },
  getAllSchools: async (req, user_id) => {
    try {
      //fitler
      const filter1 = {};
      const filter2 = {};
      req.query.status ? (filter1.status = req.query.status) : null;

      //accessibleIds of this user
        const { entityId, entityType, isSubUser, parentEntityId } = await modelHelper.entityDetails(user_id);
        if (entityType != "super admin") {
          if (entityType == "district" && !isSubUser)
            filter2.district_id = entityId;
          else if (entityType == "district" && isSubUser)
            filter2.district_id = parentEntityId;
        }

      //serach
      const searchBy = {};
      req.query.search ? (searchBy.name = req.query.search) : null;
      req.query.district_id
        ? (searchBy.district_id = req.query.district_id)
        : null;

      //pagging
      const { page_size, page_no = 1 } = req.query;
      const pagging = {};
      parseInt(page_size)
        ? (pagging.offset = parseInt(page_size) * (page_no - 1))
        : null;
      parseInt(page_size) ? (pagging.limit = parseInt(page_size)) : null;
      const { count, rows } = await User.findAndCountAll({
        distinct: true,
        attributes: { exclude: ["password", "token"] },
        where : filter1,
        include: [
          {
            model: School,
            required: true,
            where: { ...filter2, ...searchBy, deleted_at: null },
            include: [
              {association:"classes", required: false, where:{deleted_at: null, archived_at:null}},
              "students"
            ],
          },
        ],
        ...pagging,
      });
      const data = rows.map((row) => {
        const temp = row.toJSON();
        temp.school.classes = row.toJSON().school.classes.length;
        temp.school.students = row.toJSON().school.students.length;
        return temp;
      });
      return utils.responseGenerator(StatusCodes.OK, "Schools fetched", {
        count,
        rows: data,
      });
    } catch (err) {
      throw err;
    }
  },
  getSchool: async (param_id, user_id) => {
    try {
      const filter1 = { id: param_id };
      const filter2 = {};
      //accessibleIds of this user
      if (param_id != user_id) {
        const { entityId, entityType, isSubUser, parentEntityId } = await modelHelper.entityDetails(user_id);
        if (entityType != "super admin") {
            if (entityType == "district" && !isSubUser)
              filter2.district_id = entityId;
            else if (entityType == "district" && isSubUser)
              filter2.district_id = parentEntityId;
            else {
              const ids = await modelHelper.accessibleIds(user_id);
              filter1.createdBy = [user_id, ...ids];
            }
        }
      }
      const schoolDetails = await User.findOne({
        where: filter1,
        attributes: { exclude: ["password", "token"] },
        include: [
          {
            model: School,
            required: true,
            where: { ...filter2, deleted_at: null },
          },
        ],
      });
      if (!schoolDetails)
        return utils.responseGenerator(
          StatusCodes.BAD_REQUEST,
          "School does not exist"
        );

      const role = await Role.findOne({ where: { id: schoolDetails.role_id } });
      /*Get District Details, 'b'*/
      const district_details = await DistrictAdmin.findOne({
        where: { id: schoolDetails.dataValues.school.dataValues.district_id },
      });
      /*Get District Details, passed district_details, 'b'*/
      const data = {
        ...schoolDetails.toJSON(),
        role_id: undefined,
        role,
        district_details,
      };

      return utils.responseGenerator(
        StatusCodes.OK,
        "School fetched successfully",
        data
      );
    } catch (err) {
      throw err;
    }
  },

  getSchoolById: async (req) => {
    try {

      if (isNaN(req.query.districtId) && isNaN(req.query.schoolId)) {
        return utils.responseGenerator(
          StatusCodes.BAD_REQUEST,
          "School does not exist"
        );
      }
      const filter = {};
      !isNaN(req.query.districtId) ? (filter.district_id = req.query.districtId) : null;
      !isNaN(req.query.schoolId) ? (filter.id = req.query.schoolId) : null;
      //accessibleIds of this user
      // const districtAdmin = await DistrictAdmin.findOne({ where: { id: param_id } });
      // const accessId = districtAdmin.user_id
      // const ids = await modelHelper.accessibleIds(accessId);
      // filter.createdBy = [accessId, ...ids];

      console.log("filter *************", filter);
      const rows = await School.findAll({
        attributes: ["id", "district_id", "name"],
        where: { ...filter },
      });

      if (!rows)
        return utils.responseGenerator(
          StatusCodes.BAD_REQUEST,
          "School does not exist"
        );
      return utils.responseGenerator(
        StatusCodes.OK,
        "School fetched successfully",
        rows
      );
    } catch (err) {
      throw err;
    }
  },

  updateSchool: async (reqBody, param_id, user_id) => {
    try {
      let isEmailChanged;
      let school;
      const filter1 = {};
      const filter2 = {};

      //accessibleIds of this user
      if (param_id != user_id) {
        const { entityId, entityType, isSubUser, parentEntityId } = await modelHelper.entityDetails(user_id);
        if (entityType != "super admin") {
          if (entityType == "district" && !isSubUser)
              filter2.district_id = entityId;
            else if (entityType == "district" && isSubUser)
              filter2.district_id = parentEntityId;
            else {
              const ids = await modelHelper.accessibleIds(user_id);
              filter1.createdBy = [user_id, ...ids];
            }
        }
      }
      reqBody.updatedBy = user_id;
      const userDetails = await User.findOne({
        where: { id: param_id },
        include: [
          {
            model: School,
            required: true,
            where: filter2,
            attributes: [],
          },
        ],
      });
      if (userDetails) {
        if (reqBody.email && userDetails.email != reqBody.email) {
          let accessToken = JWTHelper.getAccessToken(
            userDetails,
            userDetails.password
          );
          let resetPasswordLink = `${resetPasswordPath}?token=${accessToken}`;
          let templateData = {
            reset_link: resetPasswordLink,
          };

          utils.sendEmail(reqBody.email, resetPasswordTemplateId, templateData);
          isEmailChanged = true;
        } else {
          isEmailChanged = false;
        }

        await User.update(reqBody, { where: { id: param_id, ...filter1 } });
      } else {
        return utils.responseGenerator(
          StatusCodes.NOT_FOUND,
          "No details found"
        );
      }

      let schoolDetails = await School.findOne({
        where: {
          user_id: param_id,
        },
      });
      if (schoolDetails) {
        school = await School.update(reqBody,
          {
            where: { user_id: param_id, ...filter1 },
          });
      } else {
        return utils.responseGenerator(
          StatusCodes.NOT_FOUND,
          "School details not found"
        );
      }

      const data = {
        user: userDetails[0],
        school: school,
        isEmailChanged: isEmailChanged,
      };

      if (reqBody.isSendPaymentLink) {
        // Send payment request email
        //  const customer = await stripeHelper.createCustomer(reqBody.email, reqBody.admin_account_name);
        const customer = schoolDetails.customerId;

        const subscribePackageDetails = await SubscribePackage.findOne({
          // attributes: ["subscriptionId"],
          where: {
            entityId: param_id,
            roleId: userDetails.role_id,
            isActive: true,
          },
        });

        if (subscribePackageDetails) {
          await SubscribePackage.update(
            { isActive: false },
            {
              where: {
                entityId: param_id,
                roleId: userDetails.role_id,
                isActive: true,
              },
            }
          );
        }
        // if (subscribePackageDetails.subscriptionId)
        //   await stripeHelper.cancelSubscription(
        //     subscribePackageDetails.subscriptionId
        //   );

        const newSubscribePackage = await SubscribePackage.create({
          uuid: await utils.getUUID("SP"),
          entityId: param_id,
          roleId: userDetails.role_id,
          packageId: reqBody.package_id,
        });

        // Send payment request email
        const packageDetails = await SubscriptionPackage.findOne({
          attributes: [
            "packageTitle",
            "packageFor",
            "price",
            "status",
            "priceId",
          ],
          where: { id: reqBody.package_id },
        });

        const session = await stripeHelper.createSession(
          packageDetails,
          customer,
          newSubscribePackage.id,
          packageDetails.priceId
        );

        await SubscribePackage.update(
          { sessionId: session.id },
          { where: { id: newSubscribePackage.id }}
        );

        // let paymentRequestTemplateData = {
        //   checkout_link: session.url,
        // };
        // utils.sendEmail(
        //   reqBody.email,
        //   paymentRequestTemplateId,
        //   paymentRequestTemplateData
        // );
      }
      return utils.responseGenerator(
        StatusCodes.OK,
        "School details updated successfully",
        data
      );
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        return utils.responseGenerator(
          StatusCodes.CONFLICT,
          "School already exist"
        );
      } 
      console.log("Error ==> ", err);
      throw err;
    }
  },

  // createSchoolAdmin: async (reqBody) => {
  //   try {
  //     const { district_id, name ,package_id} = reqBody;
  //     if (district_id) {
  //       const count = await DistrictAdmin.count({ where: { id: district_id } });
  //       if (!count) {
  //         return utils.responseGenerator(
  //           StatusCodes.BAD_REQUEST,
  //           "District do not exist"
  //         );
  //       }
  //     }
  //     reqBody.createdBy = null;
  //     reqBody.updatedBy = null;

  //     const password = utils.randomString(10);

  //     const customer = await stripeHelper.createCustomer(
  //       reqBody.email,
  //       reqBody.first_name
  //     );

  //     const savedUser = await User.create({
  //       ...reqBody,
  //       password: await utils.bcryptPassword(password),
  //     });
  //     const savedSchool = await School.create({
  //       ...reqBody,
  //       user_id: savedUser.id,
  //       customerId: customer.id,
  //     });
  //     const savedSubscribePackage = await SubscribePackage.create({
  //       entityId: savedSchool.id,
  //       roleId: reqBody.role_id,
  //       packageId: package_id,
  //     });
  //     let accessToken = JWTHelper.getAccessToken(savedUser, savedUser.password);
  //     let resetPasswordLink = `${resetPasswordPath}?token=${accessToken}`;
  //     let templateData = {
  //       reset_link: resetPasswordLink,
  //     };
  //     await User.update(
  //       { token: accessToken },
  //       {
  //         where: {
  //           id: savedUser.id,
  //         },
  //       }
  //     );
  //     await School.update(
  //       {
  //         subscribeId: savedSubscribePackage.id,
  //       },
  //       { where: { id: savedSchool.id } }
  //     );

  //     if (reqBody.isSendPaymentLink) {
  //       // Send payment request email
  //       let packageDetails = await SubscriptionPackage.findOne({
  //         attributes: ["packageTitle", "price"],
  //         where: { id: package_id },
  //       });
  //       const session = await stripeHelper.createSession(
  //         packageDetails,
  //         customer.id,
  //         savedSubscribePackage.id
  //       );
  //       const queryParam = utils.encrypt(`session_id=${session.id}`);
  //       const checkoutLink = `${checkoutdPath}?${queryParam}`;
  //       let paymentRequestTemplateData = {
  //         checkout_link: checkoutLink,
  //       };
  //       utils.sendEmail(
  //         reqBody.email,
  //         paymentRequestTemplateId,
  //         paymentRequestTemplateData
  //       );
  //     }

  //     await utils.sendEmail(
  //       reqBody.email,
  //       resetPasswordTemplateId,
  //       templateData
  //     );

  //     const data = {
  //       ...savedUser.dataValues,
  //       ...savedSchool.dataValues,
  //       password: undefined,
  //       subscribeId: savedSubscribePackage.id,
  //     };
  //     return utils.responseGenerator(
  //       StatusCodes.OK,
  //       "Email send successfully",
  //       {
  //         ...data,
  //       }
  //     );
  //   } catch (err) {
  //     throw err;
  //   }
  // },

  getSchoolByUserId: async (param_id) => {
    try {
      if (!param_id) {
        return utils.responseGenerator(
          StatusCodes.BAD_REQUEST,
          "User id is missing"
        );
      }
      const filter = {};
      filter.user_id = param_id;
      const rows = await School.findAll({
        where: { ...filter },
      });

      if (!rows)
        return utils.responseGenerator(
          StatusCodes.BAD_REQUEST,
          "School does not exist"
        );
      return utils.responseGenerator(
        StatusCodes.OK,
        "School fetched successfully",
        rows
      );
    } catch (err) {
      throw err;
    }
  },

  getAllSchooAdmins: async (req) => {
    try {
      //fitler
      const filter = {};
      req.query.status ? (filter.status = req.query.status) : null;
      //accessibleIds of this user
      //serach
      const searchBy = {};
      req.query.search ? (searchBy.name = req.query.search) : null;
      req.query.district_id
        ? (searchBy.district_id = req.query.district_id)
        : null;
      //pagging
      const { page_size, page_no = 1 } = req.query;
      const pagging = {};
      parseInt(page_size)
        ? (pagging.offset = parseInt(page_size) * (page_no - 1))
        : null;
      parseInt(page_size) ? (pagging.limit = parseInt(page_size)) : null;
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

      const { count, rows } = await User.findAndCountAll({
        where: { ...filter },
        attributes: { exclude: ["password", "token"] },
        include: [
          {
            model: School,
            required: true,
            where: { ...searchBy },
            include: ["classes", "students"],
          },
        ],
        ...pagging,
      });
      const data = rows.map((row) => {
        const temp = row.toJSON();
        temp.school.classes = row.toJSON().school.classes.length;
        temp.school.students = row.toJSON().school.students.length;

        return temp;
      });
      return utils.responseGenerator(StatusCodes.OK, "Schools fetched", {
        count,
        rows: data,
      });
    } catch (err) {
      throw err;
    }
  },

  deleteSchool: async (id, reqBody, reqUser) => {
    try {
      reqBody.deletedBy = reqUser.id;
      reqBody.deletedAt = new Date();

      let deleteById = await School.update(reqBody, {
        where: {
          id: id,
        },
      });
      return utils.responseGenerator(
        StatusCodes.OK,
        "Deleted School Successfully",
        deleteById
      );
    } catch (err) {
      next(err);
    }
  },

  dashboardGraphData: async (param_id, user_id) => {
    const classDetails = await Class.findAll({
      where: { school_id: param_id },
      attributes: ["id"],
    });

    classIds = classDetails.map((obj) => obj.id);

    try {
      let StudentCount = await ClasStudent.count({
        where: {
          classId: classIds,
        },
        include: [
          {
            model: Student,
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      });

      let assignmentQuestionsData = await AssignLesson.findAll({
        attributes: ["id", "lesson_id", "classId"],
        where: { classId: classIds },
        include: [
          {
            model: Lesson,
            attributes: ["id"],
            include: [
              {
                model: Question,
                attributes: ["id", "transactionId", "questionTypeId"],
                where: { isDelete: false },
                required: false,
                include: [
                  {
                    association: "questionType",
                    attributes: ["id", "title", "key"],
                    where: { key: ["ela", "math", "ngss", "ncss"] },
                  },
                ],
              },
            ],
          },
        ],
      });

      let StudentsAnswersData = await ClasStudent.findAll({
        attributes: ["id", "studentId", "classId"],
        where: { classId: classIds },
        include: [
          {
            model: Student,
            attributes: ["id", "firstName", "lastName"],
            include: [
              {
                model: StudentLessonAnswer,
                attributes: [
                  "id",
                  "studentId",
                  "assignLessonId",
                  "questionId",
                  "isCorrect",
                  "pointsEarned",
                ],
                as: "studentLessonAnswers",
                include: [
                  {
                    model: Question,
                    attributes: ["id", "transactionId", "questionTypeId"],
                    where: { isDelete: false },
                    required: true,
                    include: [
                      {
                        association: "questionType",
                        attributes: ["id", "title", "key"],
                        where: { key: ["ela", "math", "ngss", "ncss"] },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      assignmentQuestionsData = JSON.parse(
        JSON.stringify(assignmentQuestionsData)
      );
      StudentsAnswersData = JSON.parse(JSON.stringify(StudentsAnswersData));

      let assessment = (key, type) => {
        let questionArray = assignmentQuestionsData.map(
          (obj) =>
            obj.lesson.questions.filter(
              (quesObj) => quesObj.questionType.key == key
            ).length
        );
        let questionCount = questionArray.length
          ? questionArray.reduce((a, b) => a + b)
          : 0;

        if (type == 1) {
          let answerArray = StudentsAnswersData.map(
            (obj) =>
              obj.student.studentLessonAnswers.filter(
                (studObj) => studObj.question.questionType.key == key
              ).length
          );
          let totalAnswerCount = answerArray.length
            ? answerArray.reduce((a, b) => a + b)
            : 0;
          let StudentAnsweredCount = answerArray.filter(
            (index) => index !== 0
          ).length;
          let stduentAnswerPercent =
            (totalAnswerCount /
              StudentAnsweredCount /
              (StudentCount * questionCount)) *
            100;
          return stduentAnswerPercent ? parseInt(stduentAnswerPercent) : 0;
        }

        if (type == 2) {
          let obj = {};
          let answerArray = StudentsAnswersData.map(
            (obj) =>
              obj.student.studentLessonAnswers.filter(
                (studObj) =>
                  studObj.isCorrect == true &&
                  studObj.question.questionType.key == key
              ).length
          );
          obj.totalCorrectAnswerCount = answerArray.length
            ? answerArray.reduce((a, b) => a + b)
            : 0;
          obj.studentAnsweredCount = answerArray.filter(
            (index) => index !== 0
          ).length;
          obj.correctAnswerPercent =
            (obj.totalCorrectAnswerCount /
              obj.studentAnsweredCount /
              (StudentCount * questionCount)) *
            100;
          return obj.correctAnswerPercent
            ? parseInt(obj.correctAnswerPercent)
            : 0;
        }
      };

      let practiceData = {
        ela: assessment("ela", "1"),
        math: assessment("math", "1"),
        ngss: assessment("ngss", "1"),
        ncss: assessment("ncss", "1"),
      };

      let growthData = {
        ela: assessment("ela", "2"),
        math: assessment("math", "2"),
        ngss: assessment("ngss", "2"),
        ncss: assessment("ncss", "2"),
      };

      return utils.responseGenerator(
        StatusCodes.OK,
        "Report fetched successfully",
        { practiceData, growthData }
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
