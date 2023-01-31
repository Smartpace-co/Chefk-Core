let Role = require("../models").roles;
let Student = require("../models").students;
let Class = require("../models").classes;
let Class_student = require("../models").class_students;
let Student_allergen = require("../models").student_allergens;
let Student_medical_condition = require("../models").student_medical_conditions;
let SubscribePackage = require("../models").subscribe_packages;
let notificationService = require("../service/notificationService");
let { studentSettings } = require("../constants/setting");
const { sequelize } = require("../models/index");
let JWTHelper = require("../helpers/jwtHelper");
let utils = require("../helpers/utils");
let stripeHelper = require("../helpers/stripeHelper");
let modelHelper = require("../helpers/modelHelper");
let { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];
let generalTemplateId = config.sendgrid.general_template_id;

//////////////////////////////// FUNCTIONS
async function createSubPackage  (reqBody, studentId, t) {
  let subscribePackageDetails = {}
  if (!reqBody.parentId) {
    subscribePackageDetails = await SubscribePackage.create(
      {
        uuid: utils.getUUID("SP"),
        entityId: studentId,
        roleId: reqBody.roleId, // change by ps
        packageId: reqBody.packageId, // chnage by ps
      },
      { transaction: t }
    );

    await Student.update(
      { subscribeId: subscribePackageDetails.id },
      {
        where: {
          id: studentId,
        },
        transaction: t,
      }
    );
  } else {
    subscribePackageDetails = await SubscribePackage.findOne({
      where: { entityId: reqBody.parentId },
    });

    await Student.update(
      { subscribeId: subscribePackageDetails.id },
      {
        where: {
          id: studentId,
        },
        transaction: t,
      }
    );
  }

  return subscribePackageDetails;
}

async function updateSt(reqBody, studentId, t) {
  try {

    let accessToken = JWTHelper.getAccessTokenCleverUser(studentId, true);

    // add roleId if not available
    !reqBody.roleId
      ? (reqBody.roleId = (
          await Role.findOne({ where: { title: "student" } })
        ).id)
      : null;

    const customer = await stripeHelper.createCustomer(
      reqBody.contactPersonEmail,
      reqBody.firstName
    );

    await Student.update(
      {
        ...reqBody,
        parentId: reqBody.parentId,
        password: "fake-password" + Date.now(),
        customerId: customer.id,
        token: accessToken,
        status: true,
        userName: utils.getUUID("ST") // Clever-student will not use userName. this to skip database unique
      },
      {
        where: {
          id: studentId,
        },
        transaction: t,
      }
    );



    await modelHelper.addSettings(
      studentId,
      reqBody.roleId,
      studentSettings,
      t
    );

    // add welcome notification
    await notificationService.createNotifications(
      studentId,
      reqBody.roleId,
      reqBody.createdBy,
      "new_account"
    );


    return customer.id
  } catch (err) {
    throw err;
  }
}

module.exports = {
  completeCreateStudent: async (reqBody, studentId, userId = null) => { // will be his teacher
    const t = await sequelize.transaction();
    // #TODO: search about user_id variables and clever it
    try {
      const { classIds, allergenIds, medicalConditionIds, priceId } = reqBody;

      reqBody.parentRoleId = reqBody.roleId ? reqBody.roleId : undefined;

      const customerId = await updateSt(reqBody, studentId, t);

      if (classIds) {
        const processedClassIds = classIds.map((classId) => {
          return { studentId: studentId, classId, createdBy: userId };
        });
        await Class_student.bulkCreate(processedClassIds, { transaction: t });

        // email and notify the students
        const clses = await Class.findAll({
          attributes: ["id", "title"],
          where: { id: classIds },
        });
        const roleId = (await Role.findOne({ where: { title: "Student" } })).id;

        for (cls of clses) {
          let templateData = {
            subject: "Added to class",
            header: "You have been added to a class",
            content: `Class Name: ${cls.title}, Student Name:${reqBody.firstName} ${reqBody.lastName}`,
          };
          utils.sendEmail(
            reqBody.contactPersonEmail,
            generalTemplateId,
            templateData
          );
          await notificationService.createNotifications(
            studentId,
            roleId,
            userId,
            "added_to_class",
            { className: cls.title }
          );
        }
      }

      if (allergenIds) {
        const processedAllergenIds = allergenIds.map((allergenId) => {
          return { studentId: studentId, allergenId, createdBy: userId };
        });
        await Student_allergen.bulkCreate(processedAllergenIds, {
          transaction: t,
        });
      }

      if (medicalConditionIds) {
        const processedMedicalCondtionIds = medicalConditionIds.map(
          (medicalConditionId) => {
            return {
              studentId: studentId,
              medicalConditionId,
              createdBy: userId,
            };
          }
        );

        await Student_medical_condition.bulkCreate(
          processedMedicalCondtionIds,
          { transaction: t }
        );
      }

      const savedSubPackages = await createSubPackage(reqBody, studentId, t);

      await t.commit();

      return {
        subscribeId: savedSubPackages.id,
        customerId,
        priceId,
      };

    } catch (err) {
      await t.rollback();
      throw err;
    }
  },
  getStudent: async (option) => {
    try {
      const student = await Student.findOne({
        where: { ...option },
      });
      return student.dataValues;
    } catch (error) {
      throw error;
    }
  },
  updateCleverStudent: async (data, option) => {
    try {
      await Student.update(data, {
        where: { ...option },
      });
    } catch (error) {
      throw error;
    }
  },
};
