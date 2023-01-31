const JWTHelper = require("../helpers/jwtHelper");
let CleverUser = require("../models/").clever_users;
let User = require("../models/").users;
let Student = require("../models/").students;
let Grade = require("../models/").grades;
let DistrictAdmin = require("../models").district_admins;
let DistrictUser = require("../models").district_users;
let School = require("../models").schools;
let SchoolUser = require("../models").school_users;
let Teacher = require("../models").teachers;
let SubscriptionPackage = require("../models").subscription_packages;
let SubscribePackage = require("../models").subscribe_packages;
const Role = require("../models/").roles;
let Setting = require("../models").settings;
let SystemLanguage = require("../models").system_languages;
let utils = require("../helpers/utils");
let LogSession = require("../models").log_sessions;
let { StatusCodes } = require("http-status-codes");
require("dotenv").config();
let { sequelize } = require("../models/index");
const cleverUtils = require("../helpers/cleverUtils");
const { UniqueConstraintError } = require("sequelize");

const trialPeriod = 7; // in days

const getRoleId = (roles, roleName) => {
  let res = 1;
  roleName = roleName.toLowerCase();
  for (let i = 0; i < roles.length; i++) {
    const title = roles[i].title.toLowerCase();
    if (title === roleName) {
      res = roles[i].id;
      break;
    }
  }
  return res;
};

const createUser = async (data, roleName, t) => {
  const roles = await Role.findAll({});
  const objUser = {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    password: data.token,
    status: true,
    from_clever: true,
    role_id: getRoleId(roles, roleName),
  };

  const user = await User.create(objUser, { transaction: t });
  return user.dataValues;
};

const createStudent = async (data, parentId, t) => {
  const objStudent = {
    firstName: data.first_name,
    lastName: data.last_name,
    gradeId: data.grade_id,
    password: data.token,
    status: true,
    from_clever: true,
    // Temporary Data until next-request to complete register-student
    customerId: data.id + Date.now(),
    userName: utils.getUUID("USER"),
  };

  if(parentId){
    objStudent['parentId'] = parentId;
  }

  const student = await Student.create(objStudent, { transaction: t });
  return student.id;
};

module.exports = {
  getCleverUser: async (option) => {
    try {
      const cleverUser = await CleverUser.findOne({
        where: { ...option },
      });
      // edit to return null
      return cleverUser?.dataValues;
    } catch (error) {
      throw error;
    }
  },
  getUser: async (option)=> {
    try {
      const savedUser = await User.findOne({
        where: { ...option },
      });
      // edit to return null
      return savedUser?.dataValues;
    } catch (error) {
      throw error;
    }

  },
  initUserStudent: async (cleverData, secret, parentId = null) => {
    const t = await sequelize.transaction();

    let gradeId = null;
    if (cleverData.roles.student.grade) {
      const grades = await Grade.findAll({});
      let gName = cleverData.roles.student.grade;
      gradeId = cleverUtils.getGradeIdBasedCleverGrade(grades, gName);
    }

    let data = {
      id: cleverData.id,
      token: cleverData.token,
      first_name: cleverData.name.first,
      last_name: cleverData.name.last,
      grade_id: gradeId,
    };

    try {
      const studentId = await createStudent(data, parentId,  t);

      const cleverData = {
        id: data.id,
        token: data.token,
        redirect_secret: secret,
        student_id: studentId,
        user_id: null,
      };

      await CleverUser.create(cleverData, { transaction: t });

      await t.commit();
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        // need to update user is his data change in clever
        await t.rollback();
      }else {
        await t.rollback();
        throw error;

      }
    }
  },
  initUserTeacher: async (cleverData, secret) => {
    const t = await sequelize.transaction();

    let data = {
      id: cleverData.id,
      token: cleverData.token,
      first_name: cleverData.name.first,
      last_name: cleverData.name.last,
      email: cleverData?.email || `${data.id}@clever.com`, // TempEmail to prevent Duplicate, update next
    };

    try {
      const user = await createUser(data, "teacher", t);

      const teacherData = {
        user_id: user.id,
        role_id: user.role_id,
        first_name: data.first_name,
        last_name: data.last_name,
        customerId: data.id + Date.now(), // Temporary Data until next-request to complete register-Teacher
      };

      await Teacher.create(teacherData, {
        transaction: t,
      });

      const cleverData = {
        id: data.id,
        token: data.token,
        redirect_secret: secret,
        student_id: null,
        user_id: user.id,
      };

      await CleverUser.create(cleverData, { transaction: t });

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },
  getUserInfo: async (userPaylod) => {
    // add grade into paylod usertoken
    const secret = userPaylod.redirectSecret;
    const cleverRole = userPaylod.cleverRole;
    const data = {};

    if (!secret || !cleverRole) return null;

    let userClever;
    let userDetails; // teacherDetails
    try {
      userClever = await CleverUser.findOne({
        where: { redirect_secret: secret },
      });

      if (cleverRole === "student") {
        const studentDetails = await Student.findOne({
          attributes: { exclude: ["password"] },
          where: { id: userClever.student_id },
        });

        const gradeDetails = await Grade.findOne({
          where: { id: studentDetails.grade_id },
        });

        data["id"] = studentDetails.id;
        data["first_name"] = studentDetails?.firstName ?? "";
        data["last_name"] = studentDetails?.lastName ?? "";
        data["grade"] = gradeDetails?.grade ?? null;
      } else if (cleverRole === "teacher" || cleverRole === "district") {
        const user = await User.findOne({
          attributes: { exclude: ["password"] },
          where: { id: userClever.user_id },
        });

        const DB = cleverRole === "teacher" ? Teacher : DistrictAdmin;
        userDetails = await DB.findOne({
          where: { user_id: userClever.user_id },
        });

        data["id"] = user.id;
        data["first_name"] = userDetails.first_name;
        data["last_name"] = userDetails.last_name;
        if (user.email !== `${userClever.id}@clever.com`) {
          data["email"] = user.email;
        }
      }

      data['token'] = userClever?.token;
      data['cleverId'] = userClever?.id;
      data['teacherId'] = userDetails?.id;
      return {
        is_completed: userClever.is_completed,
        data: { ...data, cleverRole },
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  updateCleverUser: async (data, filter) => {
    await CleverUser.update(data, {
      where: { ...filter },
    });
  },
  updateUser: async (data, filter) => {
    try {
      await User.update(data, {
        where: { ...filter },
      });
    } catch (error) {
      throw error;
    }
  },  
  cleverUserLogin: async (userId) => {
    try {
      let subscribePackageDetails,
        isSubscriptionPause = false,
        isTrialPeriodEnd = false,
        signupDate,
        utcDate = new Date(new Date().toUTCString());

      const user = await User.findOne({
        attributes: { exclude: ["token"] },
        where: { id: userId },
      });

      if (user) {
        if (user.isAdmin) {
          return utils.responseGenerator(StatusCodes.UNAUTHORIZED, "Unauthorized user");
        }

        if (!user.status) {
          return utils.responseGenerator(StatusCodes.FORBIDDEN, "User is inactive");
        }

        const role = await Role.findOne({ where: { id: user.role_id } });

        const parentRole = await Role.findOne({
          where: { id: user.parent_role_id },
        });

        let accessToken = JWTHelper.getAccessToken(user);

        await User.update(
          {
            token: accessToken,
          },
          { where: { id: userId } }
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
          signupDate = new Date(Date.parse(parentUser.createdAt));
          whereClause = {
            entityId: parentUser.id,
            roleId: parentUser.role_id,
            isActive: true,
          };
        } else {
          isSubscriptionPause = user.isSubscriptionPause;
          signupDate = new Date(Date.parse(user.createdAt));
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
            },
          ],
        });

        // One day in milliseconds
        const oneDay = 1000 * 60 * 60 * 24;

        // Calculating the time difference between two dates
        const diffInTime = utcDate.getTime() - signupDate.getTime();

        // Calculating the no. of days between two dates
        const diffInDays = Math.round(diffInTime / oneDay);

        if (diffInDays >= trialPeriod) isTrialPeriodEnd = true;

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
          session_id: subscribePackageDetails.sessionId,
          is_trial_period_end: isTrialPeriodEnd,
        });
      } else {
        return utils.responseGenerator(
          StatusCodes.UNAUTHORIZED,
          "Faild signin by Clever, try Again later!"
        );
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  cleverStudentLogin: async (studentId) => {
    try {
      let data;
      let subscribePackageDetails,
        isSubscriptionPause = false,
        isTrialPeriodEnd = false,
        signupDate,
        utcDate = new Date(new Date().toUTCString());

      const student = await Student.findOne({
        attributes: { exclude: ["token"] },
        where: { id: studentId },
      });

      if (student) {
        if (!student.status) {
          return utils.responseGenerator(StatusCodes.FORBIDDEN, "User is inactive");
        }

        const role = await Role.findOne({ where: { title: "student" } });

        let accessToken = JWTHelper.getStudentAccessToken(student);

        await Student.update(
          {
            token: accessToken,
          },
          { where: { id: studentId } }
        );

        let whereClause = {};
        if (student.parentId) {
          const parentUser = await User.findOne({
            where: { id: student.parentId },
          });

          isSubscriptionPause = parentUser.isSubscriptionPause;
          signupDate = new Date(Date.parse(parentUser.createdAt));
          whereClause = {
            entityId: parentUser.id,
            roleId: parentUser.role_id,
            isActive: true,
          };
        } else {
          isSubscriptionPause = student.isSubscriptionPause;
          signupDate = new Date(Date.parse(student.createdAt));
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

        // One day in milliseconds
        const oneDay = 1000 * 60 * 60 * 24;

        // Calculating the time difference between two dates
        const diffInTime = utcDate.getTime() - signupDate.getTime();

        // Calculating the no. of days between two dates
        const diffInDays = Math.round(diffInTime / oneDay);

        if (diffInDays >= trialPeriod) isTrialPeriodEnd = true;

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
          session_id: subscribePackageDetails.sessionId,
          is_trial_period_end: isTrialPeriodEnd,
        });
      } else {
        return utils.responseGenerator(
          StatusCodes.UNAUTHORIZED,
          "Faild signin by Clever, try Again later!"
        );
      }
    } catch (err) {
      throw err;
    }
  },
};
