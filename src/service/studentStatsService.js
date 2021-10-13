let StudentLessonProgress = require("../models").student_lesson_progress;
let StudentLessonAnswer = require("../models").student_lesson_answers;
let AssignLesson = require("../models").assign_lessons;
let LessonSetting = require("../models").lesson_settings;
let StudentLessonRating = require("../models").student_lesson_ratings;
let Stamp = require("../models").stamps;
let LevelType = require("../models").level_types;
let StudentStamp = require("../models").student_stamps;
let StudentItem = require("../models").student_items;
let Item = require("../models").items;
let ModuleMaster = require("../models").module_master;
let Recipe = require("../models").recipes;
let Country = require("../models").countries;
let Answer = require("../models").answers;
let StudentHealthHygiene = require("../models").student_health_hygiene;
let User = require("../models").users;
let Student = require("../models").students;
let District = require("../models/").district_admins;
let School = require("../models/").schools;
let Teacher = require("../models/").teachers;
let Role = require("../models").roles;
let Question = require("../models").questions;
let Activities = require("../models/").activities;
let notificationService = require("../service/notificationService");
let modelHelper = require("../helpers/modelHelper");
let sequelize = require("sequelize");
let utils = require("../helpers/utils");
let { StatusCodes } = require("http-status-codes");
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];
let generalTemplateId = config.sendgrid.general_template_id;

async function checkStudentReport(assignLessonId, studentId, studentDetails) {

  try {
    //fitler
    const filter = {};
    if (!studentId)
      return utils.responseGenerator(
        StatusCodes.BAD_REQUEST,
        "Student id missing"
      );
    if (!assignLessonId)
      return utils.responseGenerator(
        StatusCodes.BAD_REQUEST,
        "Assignment id missing"
      );

    const data = {};
    //// fetch progress
    {
      const progress = await StudentLessonProgress.findOne({
        where: {
          studentId: studentId,
          assignLessonId: assignLessonId,
        },
      });
      if (!progress)
        return utils.responseGenerator(
          StatusCodes.BAD_REQUEST,
          "report does not exist"
        );
      data.startedAt = progress.startedAt;
      data.endedAt = progress.endedAt;
      data.currentScreen = progress.currentScreen;
    }
    //// fetch steps

    const orderedSteps = [
      "story",
      "cooking",
      "learning activities",
      "assessments",
    ];
    const assignLesson = await AssignLesson.findOne({
      where: { id: assignLessonId },
    });
    let steps;
    if (assignLesson.selfAssignedBy) {
      steps = orderedSteps;
    } else {
      const { content } = await LessonSetting.findOne({
        include: [
          {
            association: "assign_lesson",
            where: { id: assignLessonId },
          },
        ],
      });
      const unorderedSteps = content.reduce((result, item) => {
        item.status == true ? result.push(item.title.toLowerCase()) : null;
        return result;
      }, []);
      steps = orderedSteps.filter((item) => unorderedSteps.includes(item));
    }
    data.steps = steps;

    //// fetch questions answered
    {
      let totalAnswer = 0;
      let correctAnswer = 0;
      data.questionsAnswered = [];

      const items = await StudentLessonAnswer.findAll({
        where: {
          studentId: studentId,
          assignLessonId: assignLessonId,
        },
        include: [{ association: "question", required: true }],
      });
      for (item of items) {
        const object = {
          id: item.question.id,
          question: item.question.question,
        };
        if (item.essay == null) {
          object.isEssayQuestion = false;
          object.studentAnswer = await Answer.findAll({
            where: { id: item.answerIds },
          });
          if (item.pointsEarned == 1) {
            object.incorrectAttempt = 0;
            object.totalAttempt = 1;
          } else if (item.pointsEarned == 0.25) {
            object.incorrectAttempt = 1;
            object.totalAttempt = 2;
          } else {
            object.incorrectAttempt = 2;
            object.totalAttempt = 2;
          }
        } else {
          object.isEssayQuestion = true;
          object.studentAnswer = item.essay;
          object.isCorrect = item.isCorrect;
        }
        data.questionsAnswered.push(object);

        // answer status for performance
        if (item.isCorrect != null) {
          // excluding unchecked essay answers
          item.isCorrect ? (correctAnswer += 1) : null;
          totalAnswer += 1;
        }
      }
      // calculate performance/skill
      const performance = (correctAnswer / totalAnswer) * 100;
      if (performance > 75) data.skill = "Advanced";
      else if (performance > 25) data.skill = "Proficient";
      else data.skill = "Emerging";
    }

    if (studentDetails.parentId) {

      const { entityType } = await modelHelper.entityDetails(studentDetails.parentId);
      const entityList = [];
      switch (entityType) {
        case "district":
          entityList.push({
            entityId: studentDetails.districtId,
            DB: District,
            settingKey: "notiStudentPerformanceAlerts",
          });
        case "school":
          entityList.push({
            entityId: studentDetails.schoolId,
            DB: School,
            settingKey: "notiStudentPerformanceAlerts",
          });
        case "teacher":
          entityList.push({
            entityId: (await AssignLesson.findOne({ where: { id: assignLessonId } })).createdBy,
            DB: Teacher,
            settingKey: "notiStudentPerformanceAlerts",
          });
      }

      //featch role
      for (let listItem of entityList) {
        if (!listItem.entityId) continue;
        const filter = listItem.DB == Teacher ? { user_id: listItem.entityId } : { id: listItem.entityId };
        const notifyTo = await listItem.DB.findOne({ attributes: ["id", "user_id"], where: { ...filter } });

        const { isEnable, roleId } = await modelHelper.getSetting(notifyTo.user_id, false, listItem.settingKey);
        if (isEnable) {
          const studentName = `${studentDetails.firstName} ${studentDetails.lastName}`;
          console.log(notifyTo.user_id)
          console.log(roleId)

          await notificationService.createNotifications(notifyTo.user_id, roleId, null, "student_performance_alert", {
            entity: studentName,
            assignmentTitle: assignLesson.assignmentTitle,
            levelName: data.skill,
          });

          //send email to teacher
          if (listItem.DB == Teacher ||listItem.DB == School ||listItem.DB == District) {
            console.log(listItem.db)
            const userData = await User.findOne({ attributes: ["id", "email", "role_id"], where: { id: listItem.entityId, status: true } });
            console.log(userData)
            const { isEnable } = await modelHelper.getSetting(userData.id, false, "notiReceiveAllNotificationsAsEmails");
            console.log(isEnable)

            if (isEnable) {
              let templateData = {
                subject: "Notification",
                header: "Student Performance Alert ",
                content: `${studentName} has completed assignment '${assignLesson.assignmentTitle}' with level '${data.skill}'`,
              };
              utils.sendEmail(userData.email, generalTemplateId, templateData);
            }
          }
        }
      }
    }
    return;
  } catch (err) {
    throw err;
  }

}

module.exports = {
  dashboardStats: async (req, user_id, isStudent) => {
    try {
      if (!isStudent) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "User not a student");
      const today = new Date();
      const weekStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 7); // exlused
      const weekEndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()); // included
      const count = await StudentStamp.count({
        where: { studentId: user_id, createdAt: { [sequelize.Op.between]: [weekStartDate, weekEndDate] } },
      });
      const data = count ? { displayNewStampAlert: true } : { displayNewStampAlert: false };
      return utils.responseGenerator(StatusCodes.OK, "Dashboard flages fetched successfully", data);
    } catch (err) {
      throw err;
    }
  },
  createLessonProgress: async (reqBody, user_id) => {
    try {
      reqBody.studentId = user_id;
      const conditions = { ...reqBody };
      delete conditions.startedAt;
      const count = await StudentLessonProgress.count({ where: conditions });
      if (count) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Lesson already started!");
      const studentLessonProgress = await StudentLessonProgress.create(reqBody);
      return utils.responseGenerator(StatusCodes.OK, "Lesson progress saved successfully", studentLessonProgress);
    } catch (err) {
      throw err;
    }
  },
  getLessonProgress: async (req, user_id, param_id) => {
    try {
      //fitler
      const filter = {};

      const studentLessonProgress = await StudentLessonProgress.findOne({
        where: { studentId: user_id, assignLessonId: param_id, ...filter },
      });
      if (!studentLessonProgress)
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Lesson progress does not exist");
      return utils.responseGenerator(StatusCodes.OK, "Lesson progress fetched successfully", studentLessonProgress);
    } catch (err) {
      throw err;
    }
  },
  updateLessonProgress: async (reqBody, user_id, param_id) => {
    try {
      const { completedStep, endedAt, timeTaken } = reqBody;
      const assignLesson = await AssignLesson.findOne({ where: { id: param_id } }); // outside for scope
      if (endedAt) reqBody.percentCompleted = 100;
      else if (completedStep) {
        const orderedSteps = ["story", "cooking", "learning activities", "assessments"];
        let steps;
        if (assignLesson.selfAssignedBy) {
          steps = orderedSteps;
        } else {
          const { content } = await LessonSetting.findOne({
            include: [{ association: "assign_lesson", where: { id: param_id } }],
          });
          const unorderedSteps = content.reduce((result, item) => {
            item.status == true ? result.push(item.title.toLowerCase()) : null;
            return result;
          }, []);
          steps = orderedSteps.filter((item) => unorderedSteps.includes(item));
        }
        const stepPerUnit = steps.length ? 100 / (steps.length + 1) : 0;
        const percentCompleted = (steps.indexOf(reqBody.completedStep.toLowerCase()) + 1) * stepPerUnit;
        percentCompleted ? (reqBody.percentCompleted = percentCompleted) : null;
      }
      const value = "total_Work_Mins + " + (timeTaken ? timeTaken : 0);
      const result = await StudentLessonProgress.update(
        { ...reqBody, totalWorkMins: sequelize.literal(value) },
        {
          where: { studentId: user_id, assignLessonId: param_id },
        }
      );


      // email and notification
      if (endedAt) {
        const assignmentTitle = assignLesson.assignmentTitle;
        // notify student on lesson completedStep
        {
          const { isEnable, roleId } = await modelHelper.getSetting(user_id, true, "notiCompleteStudentAssignment");
          if (isEnable) {
            await notificationService.createNotifications(user_id, roleId, null, "assignment_completed", {
              entity: "You",
              assignmentTitle,
            });
          }
        }
        // notify other entities on lesson completedStep
        {
          const studentDetails = await Student.findOne({ where: { id: user_id } });
          if (studentDetails.parentId) {
            const { entityType } = await modelHelper.entityDetails(studentDetails.parentId);

            const entityList = [];
            switch (entityType) {
              case "district":
                entityList.push({
                  entityId: studentDetails.districtId,
                  DB: District,
                  settingKey: "notiLatestStudentSubmissionWork",
                });
              case "school":
                entityList.push({
                  entityId: studentDetails.schoolId,
                  DB: School,
                  settingKey: "notiLatestStudentSubmissionWork",
                });
              case "teacher":
                entityList.push({
                  entityId: (await AssignLesson.findOne({ where: { id: param_id } })).createdBy,
                  DB: Teacher,
                  settingKey: "notiAssignmentSubmissions",
                });
            }
            //featch role

            for (let listItem of entityList) {
              if (!listItem.entityId) continue;
              const notifyTo = listItem.DB != Teacher? (await listItem.DB.findOne({ where: { id: listItem.entityId } })).user_id:listItem.entityId;
              const { isEnable, roleId } = await modelHelper.getSetting(notifyTo, false, listItem.settingKey);
              if (isEnable) {
                const studentName = `${studentDetails.firstName} ${studentDetails.lastName}`;
                await notificationService.createNotifications(notifyTo, roleId, user_id, "assignment_completed", {
                  entity: studentName,
                  assignmentTitle,
                });
              }

              if (listItem.DB == School ||listItem.DB == District) {
                const userData = await User.findOne({ attributes: ["id", "email", "role_id"], where: { id: listItem.entityId, status: true } });
                const { isEnable } = await modelHelper.getSetting(userData.id, false, "notiReceiveAllNotificationsAsEmails");
                if (isEnable) {
                  let templateData = {
                    subject: "Notification",
                    header: "Student submission ",
                    content: `${studentName} has completed assignment '${assignLesson.assignmentTitle}'`,
                  };
                  utils.sendEmail(userData.email, generalTemplateId, templateData);
                }
              }
            }

            // send student performance alert
            if (studentDetails.createdBy) await checkStudentReport(param_id, user_id, studentDetails);
          }
        }
        {
          // notify teacher for student performance
          let studentData = await Student.findOne({ attributes: ["id", "firstName", "lastName", "createdBy", "parentId"], where: { id: user_id } });
          if (studentData.parentId) {


            const { isEnable } = await modelHelper.getSetting(studentData.createdBy, false, "notiStudentPerformanceAlerts");
            if (isEnable) await checkStudentReport(param_id, user_id, studentData);
          }
        }

        // notify student parent/guardian
        {
          const { isEnable } = await modelHelper.getSetting(user_id, true, "sendNotiToParent");
          if (isEnable) {
            const student = await Student.findOne({ where: { id: user_id } });
            // on lesson completedStep
            {
              const { isEnable } = await modelHelper.getSetting(user_id, true, "performanceReportReadyToParent");
              if (isEnable) {
                let templateData = {
                  subject: "Notification",
                  header: "Report Is Ready",
                  content: `${assignmentTitle} assignment report is ready for student ${student.firstName} ${student.lastName}.`,
                };
                utils.sendEmail(student.contactPersonEmail, generalTemplateId, templateData);
              }
            }
            // on report ready. not for explore lesson
            {
              const { isEnable } = await modelHelper.getSetting(user_id, true, "completeStudentAssignmentToParent");
              if (isEnable && assignLesson.selfAssignedBy) {
                let templateData = {
                  subject: "Notification",
                  header: "Assignment Completed",
                  content: `Student ${student.firstName} ${student.lastName} has completed ${assignmentTitle} assignment.`,
                };
                utils.sendEmail(student.contactPersonEmail, generalTemplateId, templateData);
              }
            }
          }
        }
      }
      return utils.responseGenerator(StatusCodes.OK, "Lesson progress updated successfully", result);
    } catch (err) {
      throw err;
    }
  },



  createLessonAnswer: async (reqBody, user_id) => {
    try {
      const { isActivityAction }= reqBody;
      // save student answer
      reqBody.studentId = user_id;
      const conditions = { ...reqBody };
      ["answerTypeId", "answerIds", "essay", "isCorrect", "pointsEarned", "isActivityAction"].forEach((e) => delete conditions[e]);
      const count = await StudentLessonAnswer.count({ where: conditions });
      if (count) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "You have already responded!");
      const studentLessonAnswer = await StudentLessonAnswer.create(reqBody);

    // notify teacher about take action activity
    if (isActivityAction)
    {
      const { assignmentTitle, createdBy: assignedBy } = (
        await AssignLesson.findOne({ where: { id: reqBody.assignLessonId } })
      ).toJSON();
      // if not selfAssigned
      if (assignedBy) {
        const { isEnable, roleId } = await modelHelper.getSetting(assignedBy, false, "notiAssignmentSubmissions");
        if (isEnable) {
          const count = await StudentLessonAnswer.count({
            where: { studentId: user_id, assignLessonId: reqBody.assignLessonId, isActivityAction: true },
          });
          // >1 implies notification must be send before
          if (count == 1) {
            const { firstName, lastName } = (await Student.findOne({ where: { id: user_id } })).toJSON();
            await notificationService.createNotifications(assignedBy, roleId, null, "student_take_action_activity", {
              firstName,
              lastName,
              assignmentTitle,
            });
          }
        }
      }
    }
      return utils.responseGenerator(StatusCodes.OK, "Response saved successfully", studentLessonAnswer);
    } catch (err) {
      throw err;
    }
  },
  getLessonAnswer: async (req, user_id, param_id) => {
    try {
      //fitler
      const filter = {};
      req.query.question_id ? (filter.questionId = req.query.question_id) : null;
      const result = await StudentLessonAnswer.findAll({
        where: {
          studentId: user_id,
          assignLessonId: param_id,
          ...filter,
        },
      });
      return utils.responseGenerator(StatusCodes.OK, "Response fetched successfully", result);
    } catch (err) {
      throw err;
    }
  },
  addLessonRating: async (reqBody, user_id, isStudent) => {
    try {
      if (!isStudent) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "User not a student");
      reqBody.studentId = user_id;
      const studentLessonRating = await StudentLessonRating.create(reqBody);
      return utils.responseGenerator(StatusCodes.OK, "Lesson rating added successfully", studentLessonRating);
    } catch (err) {
      throw err;
    }
  },
  processStampsEarned: async (req, user_id, isStudent) => {
    try {
      if (!isStudent) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "User not a student");
      const data = {};
      //// prerequisites
      const preEarnedStamps = (
        await Stamp.findAll({
          attributes: ["id"],
          include: [
            {
              association: "student_stamps",
              where: { studentId: user_id },
              required: true,
              attributes: [],
            },
          ],
        })
      ).map((item) => item.id);
      const recipesLearned = await Recipe.findAll({
        include: [
          {
            association: "assign_lessons",
            required: true,
            include: {
              association: "studentProgress",
              required: true,
              where: { studentId: user_id, endedAt: { [sequelize.Op.not]: null } },
              attributes: [],
            },
          },
        ],
      });
      const moduleDetails = await ModuleMaster.findOne({
        where: { moduleKey: "stamp" },
        attributes: ["id"],
      });
      ////// Rules for country stamps
      {
        const countriesExplored = recipesLearned.map((item) => item.countryId);
        data.countryStampsEarned = await Stamp.findAll({
          where: {
            stampType: "country",
            countryId: countriesExplored,
            id: { [sequelize.Op.not]: preEarnedStamps },
            status: true,
          },
          include: [
            {
              association: "images",
              required: false,
              where: { moduleId: moduleDetails.id },
            },
          ],
        });
      }
      ////// Rules for level stamps
      {
        const totalPointsEarned = (await StudentLessonAnswer.findAll({ where: { studentId: user_id } })).reduce(
          (a, b) => a + parseInt(b.pointsEarned || 0),
          0
        );
        const levelStampsEarned = [];
        switch (true) {
          case totalPointsEarned > 90:
            levelStampsEarned.push("world traveler");
          case totalPointsEarned > 80:
            levelStampsEarned.push("experienced adventurer");
          case totalPointsEarned > 70:
            levelStampsEarned.push("geographer");
          case totalPointsEarned > 60:
            levelStampsEarned.push("taste maker");
          case totalPointsEarned > 50:
            levelStampsEarned.push("ambitious explorer");
          case totalPointsEarned > 40:
            levelStampsEarned.push("adventure seeker");
          case totalPointsEarned > 30:
            levelStampsEarned.push("problem solver");
          case totalPointsEarned > 20:
            levelStampsEarned.push("discoverer");
          case totalPointsEarned > 10:
            levelStampsEarned.push("inquirer");
          case totalPointsEarned > 0:
            levelStampsEarned.push("wanderer");
        }
        data.levelStampsEarned = await Stamp.findAll({
          attributes: {
            include: [
              [
                sequelize.literal(`case level_type.level when '${levelStampsEarned[0]}' then true else false end`),
                "isCurrentLevel",
              ],
            ],
          },
          where: {
            stampType: "level",
            id: { [sequelize.Op.not]: preEarnedStamps },
            status: true,
          },
          include: [
            {
              association: "level_type",
              attributes: [],
              required: true,
              where: { level: levelStampsEarned },
            },
            {
              association: "images",
              required: false,
              where: { moduleId: moduleDetails.id },
            },
            {
              association: "items",
              required: false,
              where: { status: true },
            },
          ],
        });
      }
      ////// Rules for learning stamps
      {
        const learningStampsEarned = [];
        const recipesCount = recipesLearned.length;
        switch (true) {
          case recipesCount >= 20:
            learningStampsEarned.push("master chef");
          case recipesCount >= 3:
            learningStampsEarned.push("sous chef");
        }
        const countriesExplored = [...new Set(recipesLearned.map((item) => item.countryId))]; // get distinct countries
        switch (true) {
          case countriesExplored >= 10:
            learningStampsEarned.push("world adventurer");
          case countriesExplored >= 3:
            learningStampsEarned.push("culinary explorer");
        }
        const completedAssignments = (
          await StudentLessonProgress.findAll({
            where: { studentId: user_id, endedAt: { [sequelize.Op.not]: null } },
          })
        ).map((item) => item.assignLessonId);
        const questionsAnswered = await StudentLessonAnswer.findAll({
          where: { studentId: user_id },
          attributes: [
            "id",
            [sequelize.literal("`question->questionType`.`key`"), "questionType"],
            [sequelize.literal("`assign_lesson->recipe`.`country_id`"), "countryId"],
          ],
          include: [
            {
              association: "question",
              required: true,
              attributes: [],
              include: [
                {
                  association: "questionType",
                  attributes: [],
                  required: true,
                  where: { key: ["activity", "math", "ncss"] },
                },
              ],
            },
            {
              association: "assign_lesson",
              required: false,
              attributes: [],
              include: [{ association: "recipe", required: false, attributes: [] }],
            },
          ],
        });
        const ncssQuestions = questionsAnswered.filter((item) => item.toJSON().questionType.toLowerCase() == "ncss");

        const distinctCountriesOfNCSS = [...new Set(ncssQuestions.map((item) => item.toJSON().countryId))]; // get distinct countries
        switch (true) {
          case distinctCountriesOfNCSS.length >= 15:
            learningStampsEarned.push("budding geographer");
          case distinctCountriesOfNCSS.length >= 10:
            learningStampsEarned.push("global genius");
        }

        const activityQuestions = questionsAnswered.filter(
          (item) => item.toJSON().questionType.toLowerCase() == "activity"
        ).length;
        switch (true) {
          case activityQuestions >= 10:
            learningStampsEarned.push("agent of change");
          case activityQuestions >= 3:
            learningStampsEarned.push("citizen scientist");
        }
        const mathQuestions = questionsAnswered.filter((item) => item.toJSON().questionType.toLowerCase() == "math")
          .length;
        switch (true) {
          case mathQuestions >= 10:
            learningStampsEarned.push("mathlete");
        }
        data.learningStampsEarned = await Stamp.findAll({
          where: {
            stampType: "learning",
            id: { [sequelize.Op.not]: preEarnedStamps },
            status: true,
          },
          include: [
            {
              association: "learning_type",
              attributes: [],
              required: true,
              where: { learning: learningStampsEarned },
            },
            {
              association: "images",
              required: false,
              where: { moduleId: moduleDetails.id },
            },
          ],
        });
      }
      ///// add earned stamps to students records
      {
        const dataArray = [...data.countryStampsEarned, ...data.levelStampsEarned, ...data.learningStampsEarned].map(
          (item) => {
            return { studentId: user_id, stampId: item.id };
          }
        );
        await StudentStamp.bulkCreate(dataArray);
      }
      return utils.responseGenerator(StatusCodes.OK, "Newly earned stamps fetched successfully", data);
    } catch (err) {
      throw err;
    }
  },
  getPassport: async (req, user_id, isStudent) => {
    try {
      if (!isStudent) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "User not a student");
      const moduleDetails = await ModuleMaster.findOne({
        where: { moduleKey: "stamp" },
        attributes: ["id"],
      });
      const stamps = await Stamp.findAll({
        attributes: {
          include: [[sequelize.literal("CASE  WHEN student_stamps.id is null THEN false ELSE true END"), "isEarned"]],
        },
        include: [
          {
            association: "student_stamps",
            where: { studentId: user_id },
            required: false,
            attributes: [],
          },
          {
            association: "images",
            required: false,
            where: { moduleId: moduleDetails.id },
          },
        ],
      });
      const data = {};
      data.countryStamps = stamps.filter((stamp) => stamp.stampType.toLowerCase() == "country");
      data.levelStamps = stamps.filter((stamp) => stamp.stampType.toLowerCase() == "level");
      data.learningStamps = stamps.filter((stamp) => stamp.stampType.toLowerCase() == "learning");
      return utils.responseGenerator(StatusCodes.OK, "Student stamps fetched successfully", data);
    } catch (err) {
      throw err;
    }
  },
  getAchievements: async (req, user_id, isStudent) => {
    try {
      if (!isStudent) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "User not a student");
      const data = {};
      // fetch all stamps earned in order
      const { count, rows } = await Stamp.findAndCountAll({
        include: [
          {
            association: "student_stamps",
            where: { studentId: user_id },
            required: true,
            attributes: [],
          },
        ],
        order: [["student_stamps", "id", "DESC"]],
      });
      // check last earned level stamp
      const levelDetails = rows.filter((row) => row.stampType.toLowerCase() == "level")[0];
      data.currentLevel = levelDetails
        ? { title: (await LevelType.findOne({ where: { id: levelDetails.levelTypeId } })).level }
        : { title: null };
      // total stamps earned
      data.stampsEarned = count;
      // total points earned
      data.totalPoints = (await StudentLessonAnswer.findAll({ where: { studentId: user_id } })).reduce(
        (a, b) => a + parseInt(b.pointsEarned || 0),
        0
      );
      // total countries visited
      const countryIds = rows.filter((row) => row.stampType.toLowerCase() == "country").map((item) => item.countryId);
      data.countriesVisited = new Set(countryIds).size; //distinct
      return utils.responseGenerator(StatusCodes.OK, "Student achievements fetched successfully", data);
    } catch (err) {
      throw err;
    }
  },
  addItemEarned: async (reqBody, user_id, isStudent) => {
    try {
      if (!isStudent) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "User not a student");
      const stampId = (await Item.findOne({ where: { id: reqBody.itemId } })).stampId;
      const items = (await Item.findAll({ where: { stampId: stampId } })).map((item) => item.id);
      const count = await StudentItem.count({ where: { itemId: items, studentId: user_id } });
      if (count)
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, `You have already selected item for this stamp.`);
      reqBody.studentId = user_id;
      const studentItem = await StudentItem.create(reqBody);
      return utils.responseGenerator(StatusCodes.OK, "Item added successfully", studentItem);
    } catch (err) {
      throw err;
    }
  },
  getLockerItems: async (req, user_id, isStudent) => {
    try {
      if (!isStudent) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "User not a student");
      //fitler
      const filter = {};
      const result = await Item.findAll({
        include: [
          {
            association: "student_items",
            required: true,
            where: { studentId: user_id },
            attributes: [],
          },
        ],
      });
      return utils.responseGenerator(StatusCodes.OK, "Locker items fetched successfully", result);
    } catch (err) {
      throw err;
    }
  },
  getLessonReport: async (req, user_id, param_id, isStudent) => {
    try {
      if (!isStudent) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "User not a student");
      //fitler
      const filter = {};
      const data = {};
      //// fetch progress
      {
        const progress = await StudentLessonProgress.findOne({
          where: { studentId: user_id, assignLessonId: param_id },
        });
        if (!progress) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "report does not exist");
        data.startedAt = progress.startedAt;
        data.endedAt = progress.endedAt;
        data.currentScreen = progress.currentScreen;
      }
      //// fetch steps
      {
        const orderedSteps = ["story", "cooking", "learning activities", "assessments"];
        const assignLesson = await AssignLesson.findOne({ where: { id: param_id } });
        let steps;
        if (assignLesson.selfAssignedBy) {
          steps = orderedSteps;
        } else {
          const { content } = await LessonSetting.findOne({
            include: [{ association: "assign_lesson", where: { id: param_id } }],
          });
          const unorderedSteps = content.reduce((result, item) => {
            item.status == true ? result.push(item.title.toLowerCase()) : null;
            return result;
          }, []);
          steps = orderedSteps.filter((item) => unorderedSteps.includes(item));
        }
        data.steps = steps;
      }
      //// fetch questions answered
      {
        let totalAnswer = 0;
        let correctAnswer = 0;
        data.questionsAnswered = [];

        const items = await StudentLessonAnswer.findAll({
          where: { studentId: user_id, assignLessonId: param_id },
          include: [{ association: "question", required: true }],
        });
        for (item of items) {
          const object = { question: item.question.question };
          if (item.essay == null) {
            object.isEssayQuestion = false;
            object.studentAnswer = await Answer.findAll({ where: { id: item.answerIds } });
            if (item.pointsEarned == 1) {
              object.incorrectAttempt = 0;
              object.totalAttempt = 1;
            } else if (item.pointsEarned == 0.25) {
              object.incorrectAttempt = 1;
              object.totalAttempt = 2;
            } else {
              object.incorrectAttempt = 2;
              object.totalAttempt = 2;
            }
          } else {
            object.isEssayQuestion = true;
            object.studentAnswer = item.essay;
            object.isCorrect = item.isCorrect;
          }
          data.questionsAnswered.push(object);

          // answer status for performance
          if (item.isCorrect != null) {
            // excluding unchecked essay answers
            item.isCorrect ? (correctAnswer += 1) : null;
            totalAnswer += 1;
          }
        }
        // calculate performance/skill
        const performance = (correctAnswer / totalAnswer) * 100;
        if (performance > 75) data.skill = "Advanced";
        else if (performance > 25) data.skill = "Proficient";
        else data.skill = "Emerging";
      }

      return utils.responseGenerator(StatusCodes.OK, "Report fetched successfully", data);
    } catch (err) {
      throw err;
    }
  },
  addHealthHygiene: async (reqBody, user_id, isStudent) => {
    try {
      if (!isStudent) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "User not a student");
      let date = new Date();
      date = date.getFullYear() + "-" + (parseInt(date.getMonth()) + 1) + "-" + date.getDate();
      // fitler
      const filter = {
        studentId: user_id,
        healthHygieneId: reqBody.healthHygieneId,
      };
      const count = await StudentHealthHygiene.count({
        where: {
          [sequelize.Op.and]: [filter, sequelize.where(sequelize.fn("date", sequelize.col("created_at")), "=", date)],
        },
      });
      if (count) return utils.responseGenerator(StatusCodes.BAD_REQUEST, `You have already answered for today.`);
      reqBody.studentId = user_id;
      const studentItem = await StudentHealthHygiene.create(reqBody);
      return utils.responseGenerator(StatusCodes.OK, "Today's answer added successfully", studentItem);
    } catch (err) {
      throw err;
    }
  },
  getHealthHygiene: async (req, user_id, param_id, isStudent) => {
    try {
      if (!isStudent) return utils.responseGenerator(StatusCodes.BAD_REQUEST, "User not a student");
      let date = new Date();
      date = date.getFullYear() + "-" + (parseInt(date.getMonth()) + 1) + "-" + date.getDate();
      //fitler
      const filter = { studentId: user_id, healthHygieneId: param_id };
      const result = await StudentHealthHygiene.findOne({
        where: {
          [sequelize.Op.and]: [filter, sequelize.where(sequelize.fn("date", sequelize.col("created_at")), "=", date)],
        },
      });
      if (!result) return utils.responseGenerator(StatusCodes.NOT_FOUND, "Not found");
      return utils.responseGenerator(StatusCodes.OK, "Today's answer fetched successfully", result);
    } catch (err) {
      throw err;
    }
  },
};
