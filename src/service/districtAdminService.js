let User = require("../models").users;
let Role = require("../models").roles;
let DistrictAdmin = require("../models").district_admins;
let SubscribePackage = require("../models").subscribe_packages;
let SubscriptionPackage = require("../models/").subscription_packages;
// let SubscriptionPackagePlan = require("../models/").subscription_package_plans;
let JWTHelper = require("../helpers/jwtHelper");
let utils = require("../helpers/utils");
let stripeHelper = require("../helpers/stripeHelper");
let modelHelper = require("../helpers/modelHelper");
let notificationService = require("../service/notificationService");
let ClasStudent = require("../models").class_students;

let { sequelize } = require("../models/index");
let { districtSettings } = require("../constants/setting");
let { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];
const resetPasswordPath = config.reset_password_path;
let resetPasswordTemplateId = config.sendgrid.reset_password_template_id;
const paymentRequestTemplateId = config.sendgrid.payment_request_template_id;
let Payment = require("../models").payments;
let ClassStudent = require("../models").class_students;
let Student = require("../models").students;
const Question = require("../models").questions;

const AssignLesson = require("../models").assign_lessons;
const StudentLessonAnswer = require("../models").student_lesson_answers;
const Lesson = require("../models").lessons;
const Class = require("../models").classes;

module.exports = {
  createDistrictAdmin: async (reqBody, id) => {
    const t = await sequelize.transaction();
    try {
      const { role_id, email, admin_account_name, package_id } = reqBody;
      reqBody.createdBy = id;
      reqBody.updatedBy = id;
      const password = utils.randomString(10);

      const customer = await stripeHelper.createCustomer(
        email,
        admin_account_name
      );

      const savedUser = await User.create(
        {
          ...reqBody,
          password: await utils.bcryptPassword(password),
        },
        { transaction: t }
      );

      const savedDistrictAdmin = await DistrictAdmin.create(
        {
          user_id: savedUser.dataValues.id,
          ...reqBody,
          customerId: customer.id,
        },
        { transaction: t }
      );

      const savedSubscribePackage = await SubscribePackage.create(
        {
          uuid: await utils.getUUID("SP"),
          entityId: savedUser.dataValues.id,
          roleId: role_id,
          packageId: package_id,
          // isOwner: true,
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

      await DistrictAdmin.update(
        {
          subscribeId: savedSubscribePackage.id,
        },
        { where: { id: savedDistrictAdmin.id }, transaction: t }
      );
      await modelHelper.addSettings(
        savedDistrictAdmin.id,
        role_id,
        districtSettings,
        t
      );
      await t.commit();

      if (reqBody.isSendPaymentLink) {
        // Send payment request email
        const packageDetails = await SubscriptionPackage.findOne({
          attributes: [
            "packageTitle",
            "packageFor",
            "price",
            "status",
            "priceId",
          ],
          where: { id: package_id },
        });
        const session = await stripeHelper.createSession(
          packageDetails,
          customer.id,
          savedSubscribePackage.id,
          packageDetails.priceId
        );

        await SubscribePackage.update(
          { sessionId: session.id },
          { where: { id: savedSubscribePackage.id } }
        );

        let paymentRequestTemplateData = {
          checkout_link: session.url,
        };
        utils.sendEmail(
          email,
          paymentRequestTemplateId,
          paymentRequestTemplateData
        );
      }
      utils.sendEmail(email, resetPasswordTemplateId, templateData);
      const data = {
        ...savedUser.dataValues,
        ...savedDistrictAdmin.dataValues,
        subscribeId: savedSubscribePackage.id,
        password: undefined,
      };

      await notificationService.createNotifications(
        savedUser.id,
        savedUser.role_id,
        id,
        "new_account",
      );
      

      return utils.responseGenerator(
        StatusCodes.OK,
        "Email send successfully",
        {
          ...data,
        }
      );
    } catch (err) {
      console.log("Error ==> ", err);
      await t.rollback();
      throw err;
    }
  },

  getDistrictAdminProfile: async (id) => {
    try {
      //auth middleware confirms that user exists
      const distAdminDetails = await User.findOne({
        where: { id: id },
        attributes: { exclude: ["password", "token"] },
        include: ["district_admin"],
      });
      //user not a district admin
      if (!distAdminDetails.district_admin) {
        return utils.responseGenerator(
          StatusCodes.NOT_FOUND,
          "No details found"
        );
      }
      const role = await Role.findOne({
        where: { id: distAdminDetails.role_id },
      });
      const data = {
        ...distAdminDetails.dataValues,
        role: role,
        role_id: undefined,
      };
      return utils.responseGenerator(StatusCodes.OK, "District admin details", {
        ...data,
      });
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },
  updateDistrictAdminProfile: async (id, reqBody) => {
    try {
      let isEmailChanged;
      let district_admin;
      const userDetails = await User.findOne({ where: { id: id } });

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
        await User.update(reqBody, { where: { id: id } });
      } else {
        return utils.responseGenerator(
          StatusCodes.NOT_FOUND,
          "No details found"
        );
      }
      let districtDetails = await DistrictAdmin.findOne({
        where: {
          user_id: id,
        },
      });
      if (districtDetails) {
        district_admin = await DistrictAdmin.update(reqBody, {
          where: { user_id: id },
        });
      } else {
        return utils.responseGenerator(
          StatusCodes.NOT_FOUND,
          "District admin details not found"
        );
      }

      const districtAdmin = await DistrictAdmin.findOne({
        where: { user_id: id },
      });
      if (reqBody.isSendPaymentLink) {
        // Send payment request email
        // const customer = await stripeHelper.createCustomer(reqBody.email, reqBody.admin_account_name);
        const customer = districtDetails.customerId;
        const subscribePackageDetails = await SubscribePackage.findAll({
          where: {
            entityId: id,
            roleId: userDetails.role_id,
          },
        });
        if (subscribePackageDetails) {
          await SubscribePackage.update(
            { isActive: false },
            {
              where: {
                entityId: id,
                roleId: userDetails.role_id,
                isActive: true,
              },
            }
          );
        }
        if (subscribePackageDetails.subscriptionId)
          await stripeHelper.cancelSubscription(
            subscribePackageDetails.subscriptionId
          );

        const savedSubscribePackage = await SubscribePackage.create({
          uuid: await utils.getUUID("SP"),
          entityId: id,
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
          districtAdmin.customerId,
          savedSubscribePackage.id,
          packageDetails.priceId
        );
        let paymentRequestTemplateData = {
          checkout_link: session.url,
        };
        utils.sendEmail(
          reqBody.email,
          paymentRequestTemplateId,
          paymentRequestTemplateData
        );
      }
      return utils.responseGenerator(
        StatusCodes.OK,
        "District Admin Details Updated Successfully",
        {
          user: userDetails[0],
          district: districtAdmin,
          isEmailChanged: isEmailChanged,
        }
      );
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },

  deleteDistrictAdmin: async (id, reqBody, reqUser) => {
    try {
      reqBody.deletedBy = reqUser.id;
      reqBody.deletedAt = new Date();
      let deleteById = await DistrictAdmin.update(reqBody, {
        where: {
          id: id,
        },
      });
      return utils.responseGenerator(
        StatusCodes.OK,
        "Deleted District Admin Successfully",
        deleteById
      );
    } catch (err) {
      next(err);
    }
  },

  getAllDistricts: async () => {
    try {
      const districts = await DistrictAdmin.findAll({});
      return utils.responseGenerator(
        StatusCodes.OK,
        "Districts fetched",
        districts
      );
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },

  getAllDistrictAdmin: async (id) => {
    try {
      const districts = await DistrictAdmin.findAll({
        include: [
          {
            model: User,
            attributes: ["id", "email", "phone_number", "status"],
          },
        ],
      });
      return utils.responseGenerator(
        StatusCodes.OK,
        "Districts fetched",
        districts
      );
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },

  dashboardGraphData: async (param_id, user_id) => {
    const filter = {};
    param_id ? (filter.district_id = param_id) : null;
    const filter1 = {};
    param_id ? (filter.districtId = param_id) : null;
    try {
      let StudentCount = await ClassStudent.count({
        include: [
          {
            model: Student,
            attributes: ["id", "firstName", "lastName"],
            where: {
              ...filter1,
            },
          },
        ],
      });

      let assignmentQuestionsData = await AssignLesson.findAll({
        attributes: ["id", "lesson_id", "classId"],

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
          {
            model: Class,
            where: {
              ...filter1,
            },
          },
        ],
      });

      let StudentsAnswersData = await ClasStudent.findAll({
        attributes: ["id", "studentId", "classId"],
        where: { ...filter1 },
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
