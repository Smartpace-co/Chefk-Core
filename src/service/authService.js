const jwt = require("jsonwebtoken");
const JWTHelper = require("../helpers/jwtHelper");
const Cryptr = require("cryptr");
let User = require("../models/").users;
let Student = require("../models/").students;
let DistrictAdmin = require("../models").district_admins;
let DistrictUser = require("../models").district_users;
let School = require("../models").schools;
let SchoolUser = require("../models").school_users;
let Teacher = require("../models").teachers;
let SubscriptionPackage = require("../models").subscription_packages;
// let SubscriptionPackagePlan = require("../models").subscription_package_plans;
let SubscribePackage = require("../models").subscribe_packages;
let Payment = require("../models").payments;
const Role = require("../models/").roles;
let Setting = require("../models").settings;
let SystemLanguage = require("../models").system_languages;
let utils = require("../helpers/utils");
let stripeHelper = require("../helpers/stripeHelper");
let modelHelper = require("../helpers/modelHelper");
let LogSession = require("../models").log_sessions;
let { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];
const sequelize = require("sequelize");
const Op = sequelize.Op;
const resetPasswordPath = config.reset_password_path;
let resetPasswordTemplateId = config.sendgrid.reset_password_template_id;

module.exports = {
  getGuestToken: async () => {
    try {
      const user = { id: null };
      let token = JWTHelper.getAccessToken(user);
      const cryptr = new Cryptr(process.env.GUEST_TOKEN_ENCRYPTION_KEY);
      const encryptedToken = cryptr.encrypt(token);
      return utils.responseGenerator(
        StatusCodes.OK,
        "Guest token generated successfully",
        {
          encryptedToken,
          guestToken: token,
        }
      );
    } catch (err) {
      throw err;
    }
  },
  login: async (email, password) => {
    try {
      let subscribePackageDetails,
        isSubscriptionPause = false;
      const user = await User.findOne({
        attributes: { exclude: ["token"] },
        where: { email: email },
      });
      if (user) {
        if (user.isAdmin)
          return utils.responseGenerator(
            StatusCodes.UNAUTHORIZED,
            "Unauthorized user"
          );
        let ispasswordsMatch = await utils.passwordComparison(
          password,
          user.password
        );
        if (!ispasswordsMatch)
          return utils.responseGenerator(
            StatusCodes.UNAUTHORIZED,
            "email or password incorrect"
          );
        if (!user.status)
          return utils.responseGenerator(
            StatusCodes.FORBIDDEN,
            "User is inactive"
          );
        const role = await Role.findOne({ where: { id: user.role_id } });
        const parentRole = await Role.findOne({
          where: { id: user.parent_role_id },
        });

        let accessToken = JWTHelper.getAccessToken(user);

        await User.update(
          {
            token: accessToken,
          },
          { where: { email: email } }
        );

        // Check payment
        let model = "";
        if (role.title === "District") {
          model = DistrictAdmin;
        } else if (role.title === "Teacher") {
          model = Teacher;
        } else if (role.title === "School") {
          model = School;
        } else if (parentRole && parentRole.title) {
          if (parentRole.title === "District") {
            model = DistrictUser;
          } else if (parentRole.title === "School") {
            model = SchoolUser;
          }
        }
        let userDetails = await model.findOne({
          where: { user_id: user.id },
        });

        let whereClause = {};
        if (userDetails.parentId) {
          const parentUser = await User.findOne({
            where: { id: userDetails.parentId },
          });
          isSubscriptionPause = parentUser.isSubscriptionPause;
          whereClause = {
            entityId: parentUser.id,
            roleId: parentUser.role_id,
            isActive: true,
          };
        } else {
          isSubscriptionPause = user.isSubscriptionPause;
          whereClause = {
            entityId: user.id,
            roleId: user.role_id,
            isActive: true,
          };
        }

        // check subscription
        subscribePackageDetails = await SubscribePackage.findOne({
          where: whereClause,
          include: [
            {
              model: SubscriptionPackage,
              // attributes: ["id"],
              // required: false,
            },
          ],
        });

        const languageSetting = await Setting.findOne({
          where: {
            entityId: userDetails.id,
            roleId: user.role_id,
            key: "languageSetYourPreferredLanguage",
          },
        });
        const language = await SystemLanguage.findOne({
          where: { id: languageSetting.content },
        });

      // log new session
      {
        const sessionDetails = {};
        sessionDetails.roleId = user.role_id;
        sessionDetails.entityId = user.id;
        sessionDetails.signInAt = sequelize.fn("NOW"); // DataBase dateTime
        sessionDetails.sessionToken = accessToken;
        await LogSession.create(sessionDetails); // create new session
      }

        delete user.isSubscriptionPause;
        return utils.responseGenerator(StatusCodes.OK, "Login successful", {
          ...userDetails.dataValues,
          ...user.dataValues,
          role: role,
          token: accessToken,
          isPaymentRemaining: !subscribePackageDetails.isPaymentPaid,
          customerId: userDetails.customerId,
          language,
          subscribeId: subscribePackageDetails.id,
          priceId: subscribePackageDetails.subscription_package.priceId,
          parentId: userDetails.parentId,
          parent_role: parentRole,
          password: undefined,
          is_subscription_pause: isSubscriptionPause,
        });
      } else {
        return utils.responseGenerator(
          StatusCodes.UNAUTHORIZED,
          "Email or password is incorrect"
        );
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  studentLogin: async (userName, password) => {
    try {
      let data;
      let subscribePackageDetails,
        isSubscriptionPause = false;
      const student = await Student.findOne({
        attributes: { exclude: ["token"] },
        where: { userName: userName },
      });
      if (student) {
        let ispasswordsMatch = await utils.passwordComparison(
          password,
          student.password
        );
        if (!ispasswordsMatch)
          return utils.responseGenerator(
            StatusCodes.UNAUTHORIZED,
            "Username or password incorrect"
          );
        if (!student.status)
          return utils.responseGenerator(
            StatusCodes.FORBIDDEN,
            "User is inactive"
          );
        const role = await Role.findOne({ where: { title: "student" } });
        let accessToken = JWTHelper.getStudentAccessToken(student);
        await Student.update(
          {
            token: accessToken,
          },
          { where: { userName: userName } }
        );

        let whereClause = {};
        if (student.parentId) {
          const parentUser = await User.findOne({
            where: { id: student.parentId },
          });
          isSubscriptionPause = parentUser.isSubscriptionPause;
          whereClause = {
            entityId: parentUser.id,
            roleId: parentUser.role_id,
            isActive: true,
          };
        } else {
          isSubscriptionPause = student.isSubscriptionPause;
          whereClause = {
            entityId: student.id,
            roleId: role.id,
            isActive: true,
          };
        }

        // check subscription
        subscribePackageDetails = await SubscribePackage.findOne({
          where: whereClause,
          include: [
            {
              model: SubscriptionPackage,
            },
          ],
        });

        const languageSetting = await Setting.findOne({
          where: {
            entityId: student.id,
            roleId: role.id,
            key: "languageSetYourPreferredLanguage",
          },
        });

        const language = await SystemLanguage.findOne({
          where: { id: languageSetting.content },
        });

       // log new session
       {
          const sessionDetails = {};
          sessionDetails.roleId = role.id;
          sessionDetails.entityId = student.id;
          sessionDetails.signInAt = sequelize.fn("NOW"); // DataBase dateTime
          sessionDetails.sessionToken = accessToken;
          await LogSession.create(sessionDetails);
        }

        delete student.isSubscriptionPause;

        data = {
          ...student.toJSON(),
          role,
          language,
          password: undefined,
        };

        return utils.responseGenerator(StatusCodes.OK, "Login successfull", {
          ...data,
          token: accessToken,
          isPaymentRemaining: !subscribePackageDetails.isPaymentPaid,
          customerId: student.customerId,
          subscribeId: subscribePackageDetails.id,
          priceId: subscribePackageDetails.subscription_package.priceId,
          is_subscription_pause: isSubscriptionPause,
        });
      } else {
        return utils.responseGenerator(
          StatusCodes.UNAUTHORIZED,
          "Username or password is incorrect"
        );
      }
    } catch (err) {
      throw err;
    }
  },
  forgotPasswordValidateEmail: async (email) => {
    try {
      const user = await User.findOne({
        where: { email: email },
      });
      if (user) {
        let accessToken = JWTHelper.getAccessToken(user, user.password);
        let resetPasswordLink = `${resetPasswordPath}?token=${accessToken}`;

        let templateData = {
          reset_link: resetPasswordLink,
        };
        await utils.sendEmail(email, resetPasswordTemplateId, templateData);
        return utils.responseGenerator(
          StatusCodes.OK,
          "Email verification send successfully"
        );
      } else {
        return utils.responseGenerator(
          StatusCodes.NOT_FOUND,
          "Email not registred"
        );
      }
    } catch (err) {
      throw err;
    }
  },
  studentForgotPasswordValidateEmail: async (userName) => {
    try {
      const student = await Student.findOne({
        where: { userName: userName },
      });
      if (student) {
        let accessToken = JWTHelper.getStudentAccessToken(
          student,
          student.password
        );
        let resetPasswordLink = `${resetPasswordPath}?token=${accessToken}`;

        let templateData = {
          reset_link: resetPasswordLink,
        };
        const emailIds = student.contactPersonEmail;
        await utils.sendEmail(emailIds, resetPasswordTemplateId, templateData);
        return utils.responseGenerator(
          StatusCodes.OK,
          "Student verification send successfully"
        );
      } else {
        return utils.responseGenerator(
          StatusCodes.NOT_FOUND,
          "Student not registred"
        );
      }
    } catch (err) {
      throw err;
    }
  },
  resetPassword: async (token, password) => {
    try {
      const decodedToken = jwt.decode(token);
      const { isStudent } = decodedToken;
      const DB = isStudent ? Student : User;
      const details = await DB.findOne({ where: { id: decodedToken.id } });
      const { user, userDetails } = await JWTHelper.verifyToken(
        token,
        details.password
      );
      if (!userDetails)
        return utils.responseGenerator(
          StatusCodes.UNAUTHORIZED,
          "Invalid Token"
        );
      await DB.update(
        {
          password: await utils.bcryptPassword(password),
          status: true,
          is_email_verified: true,
        },
        { where: { id: userDetails.id } }
      );
      return utils.responseGenerator(
        StatusCodes.OK,
        "Password reset successfully"
      );
    } catch (err) {
      throw err;
    }
  },

  getUserByToken: async (isStudent, token) => {
    try {
      const DB = isStudent ? Student : User;
      user = await DB.findOne({
        attributes: { exclude: ["password", "token"] },
        where: { token: token },
      });
      if (user) {
        return utils.responseGenerator(
          StatusCodes.OK,
          "User details fetched successfully",
          user
        );
      } else {
        return utils.responseGenerator(StatusCodes.NOT_FOUND, "User not found");
      }
    } catch (err) {
      throw err;
    }
  },
  changePassword: async (id, isStudent, currentPassword, newPassword) => {
    try {
      const DB = isStudent ? Student : User;
      const user = await DB.findOne({
        attributes: ["id", "password", "status"],
        where: { id: id },
      });
      let ispasswordsMatch = await utils.passwordComparison(
        currentPassword,
        user.password
      );
      if (!ispasswordsMatch)
        return utils.responseGenerator(
          StatusCodes.FORBIDDEN,
          "Password incorrect"
        );
      const data = await DB.update(
        { password: await utils.bcryptPassword(newPassword) },
        { where: { id: id } }
      );
      return utils.responseGenerator(StatusCodes.OK, "Password Updated");
    } catch (err) {
      throw err;
    }
  },
  logout: async (token) => {
    try {
      // close sessions
      await LogSession.update(
        {
          signOutAt: sequelize.fn("NOW"),
        },
        {
          where: {
            sessionToken: token,
          },
        }
      );
      return utils.responseGenerator(StatusCodes.OK, "Logout successful");
    } catch (err) {
      console.log(err);
      throw err;
    }
  },


  topActiveSessionTeachers: async (req) => {
    try {
      const filter = [];
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

       let role=await Role.findOne({
        where:{
          title:"Teacher"
        }
      })
      
     let details = await LogSession.findAndCountAll({
       attributes: ["session_mins"],
       where:{
         entity_id : req.query.entityId,
         role_id : role.id,
         created_at:filter.createdAt
       }
     });

      return utils.responseGenerator(
        StatusCodes.OK,
        "Top active teachers session fetched successully",
        details
      );
    } catch (err) {
      throw err;
    }
  },
  topActiveSessionStudents: async (req) => {
    try {
      const filter = [];
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

       let role=await Role.findOne({
         where:{
           title:"Student"
         }
       })

      let details = await LogSession.findAndCountAll({
        attributes: ["session_mins"],
        where:{
          entity_id : req.query.entityId,
          role_id : role.id,
          created_at:filter.createdAt
        }
      });
        if(details)
          {
            return utils.responseGenerator(
              StatusCodes.OK,
              "Top active students session fetched successully",
              details
            );
          }
          else
          {
            return utils.responseGenerator(
              StatusCodes.NOT_FOUND,
              "Session not exist"
            );
          }
    
    } catch (err) {
      console.log(err)
      throw err;
    }
  },

};
