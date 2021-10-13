const Role = require("../models/").roles;
let Lesson = require("../models").lessons;
let Class = require("../models").classes;
let Grade = require("../models").grades;
let ClasStudent = require("../models").class_students;
let Student = require("../models").students;
const Question = require("../models").questions;
const LessonSetting = require("../models").lesson_settings;
const Answer = require("../models").answers;
const AssignLesson = require("../models").assign_lessons;
const QuestionStandard = require("../models").question_standards;
const Standard = require("../models").standards;
const StudentLessonAnswer = require("../models").student_lesson_answers;
const StudentLessonProgress = require("../models").student_lesson_progress;
const StudentSession = require("../models").log_sessions;

// const
// const DifficultyLevel = require("../models").difficulty_level;

let utils = require("../helpers/utils");

let modelHelper = require("../helpers/modelHelper");
let { sequelize } = require("../models/index");
let { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = {
  dashboardNeedHelp: async (param_id, user_id) => {
    const filter = {};
    param_id ? (filter.classId = param_id) : null;
    try {
      let classStudentData = await ClasStudent.findAll({
        attributes: ["id", "studentId", "classId"],
        where: { ...filter },
        include: [
          {
            model: Student,
            attributes: ["id", "firstName", "lastName"],
            include: [
              {
                model: StudentLessonProgress,
                attributes: [
                  "id",
                  "assignLessonId",
                  "studentId",
                  "percentCompleted",
                  "startedAt",
                  "endedAt",
                ],
                as: "studentLessonProgress",
              },
            ],
          },
        ],
      });
      classStudentData = JSON.parse(JSON.stringify(classStudentData));
      classStudentData = classStudentData.map((obj) => {
        if (
          obj.student.studentLessonProgress.filter(
            (studProg) => studProg.percentCompleted <= 20
          ).length
        ) {
          delete obj.student.studentLessonProgress;
          return obj.student;
        } else undefined;
      });
      classStudentData = classStudentData.filter((obj) => obj !== undefined);

      return utils.responseGenerator(
        StatusCodes.OK,
        "Assigned lessons fetched",
        classStudentData
      );
    } catch (err) {
      throw err;
    }
  },

  dashboardGraphData: async (param_id, user_id) => {
    const filter = {};
    param_id ? (filter.classId = param_id) : null;

    try {
      let StudentCount = await ClasStudent.count({ where: { ...filter } });

      let assignmentQuestionsData = await AssignLesson.findAll({
        attributes: ["id", "lesson_id", "classId"],
        where: {
          ...filter, deletedAt: null
        },
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
        where: { ...filter },
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


          StudentsAnswersData.map(
            (obj) =>
              obj.student.studentLessonAnswers.filter(
                (studObj) => studObj.question.questionType.key == key
              )
          );

          let totalAnswerCount = answerArray.length
            ? answerArray.reduce((a, b) => a + b)
            : 0;


          let StudentAnsweredCount = answerArray.filter(
            (index) => index !== 0
          ).length;


          let stduentAnswerPercent =
            ((totalAnswerCount * StudentAnsweredCount) /
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
            ((obj.totalCorrectAnswerCount * obj.studentAnsweredCount) /
              (StudentCount * questionCount)) *
            100;
          return obj.correctAnswerPercent
            ? parseInt(obj.correctAnswerPercent)
            : 0;
          // obj.questionCount = questionCount;
          // obj.StudentCount = StudentCount;
          // return obj;
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
      throw err;
    }
  },

  getReportCategories: async (req, param_id, user_id) => {
    try {
      const filter = {};
      param_id ? (filter.classId = param_id) : null;
      user_id ? (filter.createdBy = user_id) : null;

      if (req.query.duration) {
        var today = new Date();
        var priorDate = new Date();
        if (req.query.duration == "week")
          filter.startDate = {
            [Op.between]: [
              new Date(priorDate.setDate(priorDate.getDate() - 7)),
              today,
            ],
          };
        if (req.query.duration == "month")
          filter.startDate = {
            [Op.between]: [
              new Date(priorDate.setDate(priorDate.getDate() - 30)),
              today,
            ],
          };
        if (req.query.duration == "quarter")
          filter.startDate = {
            [Op.between]: [
              new Date(priorDate.setDate(priorDate.getDate() - 120)),
              today,
            ],
          };
        if (req.query.duration == "year")
          filter.startDate = {
            [Op.between]: [
              new Date(priorDate.setDate(priorDate.getDate() - 365)),
              today,
            ],
          };
      }

      let assignmentData = await AssignLesson.findAll({
        attributes: ["id", "lesson_id", "classId"],
        where: {
          ...filter, deletedAt: null
        },
        include: [
          {
            model: Class,
            attributes: ["id", "grade_id"],
            include: [
              {
                model: Grade,
                attributes: ["id", "grade"],
              },
            ],
          },
          {
            model: Lesson,
            attributes: ["id"],
            include: [
              {
                association: "questions",
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



      assignmentData = JSON.parse(JSON.stringify(assignmentData));
      let assignmentIds = assignmentData.map((obj) => obj.id);

      let answerData = await StudentLessonAnswer.findAll({
        where: { assignLessonId: { [Op.in]: assignmentIds } },
      });
      answerData = JSON.parse(JSON.stringify(answerData));

      let questionsData = [];
      assignmentData.map((obj) => {
        for (let elm of obj.lesson.questions) questionsData.push(elm);
      });

      const totalStudentCount = await ClasStudent.count({
        where: { classId: param_id },
      });

      let createCategData = (key, titleName) => {
        let processData = {
          coverage: 0,
          proficiency: 0,
        };
        let AssignmentData = assignmentData.map((obj) =>
          obj.lesson.questions.find((ques) => ques.questionType.key === key)
            ? {
              assignmentId: obj.id,
              lessonId: obj.lesson.id,
              grade: obj.class.grade.grade,
            }
            : null
        );


        if (AssignmentData.length) {
          AssignmentData = AssignmentData.filter((obj) => obj !== null); // Get assignment Ids and lessons Ids

          processData.assignmentIds = AssignmentData.map(
            (obj) => obj.assignmentId
          ); //filter assignment ids
          processData.lessonIds = AssignmentData.map((obj) => obj.lessonId); //filter lesson ids
          processData.grade = AssignmentData.map((obj) => obj.grade)[0];
          let QuestionsData = questionsData.filter(
            (ques) => ques.questionType.key === key
          ); // filter questions data
          processData.questionsId = QuestionsData.map((ques) => ques.id); // get questions Id
          processData.totalQuestionsCount = processData.questionsId.length; // // get questions count
          let AnswerData = [];
          processData.questionsId.map((quesId) => {
            AnswerData.push(...answerData.filter((ansObj) => quesId === ansObj.questionId));
            // return answerData.filter((ansObj) => quesId === ansObj.questionId)
          }); // find answer data by questions id
          AnswerData = AnswerData.filter((obj) => obj); // remove undefined
          processData.answerCount = AnswerData.length; // assign total answers count
          processData.totalMarks = (processData.totalQuestionsCount * 1); //get total marks as per total questions

          if (processData.answerCount) {
            processData.coverage = parseInt(
              (processData.answerCount /
                (processData.totalQuestionsCount * totalStudentCount)) *
              100
            ); // get questions coverage percent
            let pointsData = AnswerData.map((obj) =>
              parseFloat(obj.pointsEarned)
            );
            // old code
            // let proficiency = pointsData.length ? pointsData.reduce((a, b) => a + b) / (processData.totalQuestionsCount * totalStudentCount) : 0;
            // processData.proficiency = parseInt((proficiency / (processData.totalQuestionsCount * totalStudentCount)) * 100); // get profociency percent
            
            // new code
            processData.proficiency = pointsData.length
              ? parseInt(
                (pointsData.reduce((a, b) => a + b) /
                  (processData.totalMarks * totalStudentCount)) * 100
              )
              : 0;
          }
          processData.questionTypeInfo = QuestionsData.length
            ? QuestionsData[0].questionType
            : { title: titleName };
          return processData;
        } else {
          return;
        }
      };

      let data = [];
      data.push(createCategData("ela", "ELA"));
      data.push(createCategData("math", "MATH"));
      data.push(createCategData("ngss", "NGSS"));
      data.push(createCategData("ncss", "NCSS"));
      data = data.filter((obj) => obj != null);

      if (data.length)
        return utils.responseGenerator(
          StatusCodes.OK,
          "Category list fetched",
          data
        );
      else
        return utils.responseGenerator(
          StatusCodes.NOT_FOUND,
          "Reports not found"
        );
    } catch (err) {
      throw err;
    }
  },

  getReportByStandard: async (req, user_id) => {
    const assignmentIds = JSON.parse(req.query.assignmentIds);
    const filter = {};

    if (req.query.classId) filter.classId = req.query.classId;
    if (!req.query.questionTypeKey) {
      return utils.responseGenerator(StatusCodes.BAD_REQUEST, "Question type is missing");
    }

    try {
      const totalStudentCount = await ClasStudent.count({ where: filter });

      let standardList = await Standard.findAll({
        attributes: ["id", "standardTitle", "status"],
      });

      let clasStudent = await ClasStudent.findAll({
        attributes: ["id", "classId", "studentId"],
        where: { ...filter },
      });

      let assignmentData = await AssignLesson.findAll({
        attributes: [
          "id",
          "assignmentTitle",
          "lessonId",
          "classId",
          "startDate",
          "endDate",
        ],
        where: {
          id: { [Op.in]: assignmentIds },
          deletedAt: null,
        },
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
                    model: QuestionStandard,
                    attributes: ["standardId"],
                    as: "questionStandard",
                  },
                  {
                    association: "questionType",
                    attributes: ["key"],
                    where: { key: req.query.questionTypeKey },
                  },
                ],
              },
            ],
          },
          {
            model: StudentLessonProgress,
            attributes: [
              "id",
              "assignLessonId",
              "studentId",
              "percentCompleted",
              "startedAt",
              "endedAt",
            ],
            as: "studentProgressList",
          },
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
          },
        ],
      });
      standardList = JSON.parse(JSON.stringify(standardList));
      assignmentData = JSON.parse(JSON.stringify(assignmentData));
      clasStudent = JSON.parse(JSON.stringify(clasStudent));

      assignmentData = assignmentData.map(obj => {
        obj.studentLessonAnswers = obj.studentLessonAnswers.map(ansObj => {
          for (let elm of obj.lesson.questions) {
            if (elm.id === ansObj.questionId) return ansObj;
          }
        });
        return obj;
      });

      assignmentData = assignmentData.map(obj => {
        obj.studentLessonAnswers = obj.studentLessonAnswers.filter(ansObj => ansObj);
        return obj;
      });

      // assignmentData = assignmentData.map((obj) => {
      //   obj.studentLessonAnswers = obj.studentLessonAnswers.filter((elm) => elm !== undefined);
      //   return obj;
      // });

      standardList = standardList.map((obj) => {
        obj.assignments = assignmentData.map((assignObj) => {
          if (
            assignObj.lesson.questions.find(
              (qObj) => (qObj.questionStandard ? qObj.questionStandard.standardId : null) === obj.id
            )
          ) {
            return assignObj;
          }
        });
        return obj;
      });


      standardList = standardList.map((obj) => {
        obj.assignments = obj.assignments.filter((elm) => elm !== undefined);
        return obj;
      });

      let standardData = standardList.filter(obj => obj.assignments.length > 0);

      standardData = standardData.map((obj) => {
        let newObj = {};
        newObj.id = obj.id;
        newObj.title = obj.standardTitle;
        let lessonCount = obj.assignments.length;
        let completedStudentData = obj.assignments.map(
          (newObj) =>
            newObj.studentProgressList.filter(
              (studProg) =>
                studProg.percentCompleted == 100 || studProg.endedAt != null
            ).length
        );
        let completedStudentCount = completedStudentData.length
          ? completedStudentData.reduce((a, b) => a + b)
          : 0;

        newObj.completePercent =
          ((completedStudentCount * lessonCount) /
            (totalStudentCount * lessonCount)) *
          100;
        newObj.completePercent = newObj.completePercent ? parseInt(newObj.completePercent) : 0;

        let questionData = obj.assignments.map(
          (newObj) => newObj.lesson.questions.length
        );
        let questionsCount = questionData.length
          ? questionData.reduce((a, b) => a + b)
          : 0;


        let studentAnswersList = [];
        obj.assignments.map((myObj) =>
          myObj.studentLessonAnswers.map((myObj2) => {
            studentAnswersList.push(myObj2);
          })
        );

        let studentData = clasStudent.map((classObj) => {
          classObj.studentAnswers = studentAnswersList.filter(
            (studObj) => studObj.studentId === classObj.studentId
          );
          return classObj;
        });

        let finalData = studentData.map((classObj) => {
          let studObj = {};
          studObj.id = classObj.id;
          studObj.studentId = classObj.studentId;
          let pointsArray = classObj.studentAnswers.map((ansObj) =>
            parseFloat(ansObj.pointsEarned)
          );
          studObj.totalMarks = pointsArray.length
            ? pointsArray.reduce((a, b) => a + b)
            : 0;
          studObj.marksPercent = parseInt(
            (studObj.totalMarks / questionsCount) * 100
          );
          return studObj;
        });

        newObj.emerging = finalData.length
          ? finalData.filter((marksData) => marksData.marksPercent < 25).length
          : 0;
        newObj.proficient = finalData.length
          ? finalData.filter(
            (marksData) =>
              marksData.marksPercent > 24 && marksData.marksPercent < 76
          ).length
          : 0;
        newObj.advanced = finalData.length
          ? finalData.filter((marksData) => marksData.marksPercent > 75).length
          : 0;

        return newObj;
      });

      return utils.responseGenerator(
        StatusCodes.OK,
        "Standard report fetched",
        standardData
      );
    } catch (err) {
      throw err;
    }
  },

  studentReportByClass: async (req, param_id, user_id) => {
    const filter = {};
    if (param_id) filter.id = param_id;
    const filter1 = {};
    if (req.query.duration) {
      var today = new Date();
      var priorDate = new Date();
      if (req.query.duration == "week")
        filter1.startDate = {
          [Op.between]: [
            new Date(priorDate.setDate(priorDate.getDate() - 7)),
            today,
          ],
        };
      if (req.query.duration == "month")
        filter1.startDate = {
          [Op.between]: [
            new Date(priorDate.setDate(priorDate.getDate() - 30)),
            today,
          ],
        };
      if (req.query.duration == "quarter")
        filter1.startDate = {
          [Op.between]: [
            new Date(priorDate.setDate(priorDate.getDate() - 120)),
            today,
          ],
        };
      if (req.query.duration == "year")
        filter1.startDate = {
          [Op.between]: [
            new Date(priorDate.setDate(priorDate.getDate() - 365)),
            today,
          ],
        };
      if (param_id) filter1.classId = param_id;
    }

    try {
      let assignmentCount = await AssignLesson.count({ where: { ...filter1, deletedAt: null } });

      let studentData = await Class.findAll({
        attributes: ["id", "title", "grade_id"],
        where: { ...filter },
        include: [
          {
            model: ClasStudent,
            attributes: ["id", "classId", "studentId"],
            include: [
              {
                model: Student,
                attributes: ["id", "firstName", "lastName"],
                include: [
                  {
                    model: StudentLessonProgress,
                    attributes: [
                      "id",
                      "assignLessonId",
                      "studentId",
                      "percentCompleted",
                      "startedAt",
                      "endedAt",
                    ],
                    as: "studentLessonProgress",
                    include: [
                      {
                        model: AssignLesson,
                        attributes: ["id", "lessonId"],
                        where: { ...filter1, deletedAt: null },
                        required: true,
                        include: [
                          {
                            model: Lesson,
                            attributes: ["id", "lessonTitle"],
                            include: [
                              {
                                model: Question,
                                attributes: ["id", "transactionId"],
                                where: { isDelete: false },
                                required: false,
                                include: [
                                  {
                                    model: QuestionStandard,
                                    attributes: ["standardId"],
                                    as: "standards",
                                    include: [
                                      {
                                        model: Standard,
                                        attributes: ["id", "standardTitle"],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
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
                  },
                ],
              },
            ],
          },
        ],
      });

      studentData = JSON.parse(JSON.stringify(studentData))[0];
      // studentData = studentData.class_students.filter(obj => obj.student.studentLessonProgress.length != 0);
      let processedData = studentData.class_students.map((obj) => {
        {
          obj = obj.student;
          let newObject = {};
          newObject.id = obj.id;
          newObject.firstName = obj.firstName;
          newObject.lastName = obj.lastName;
          newObject.totalAssignments = assignmentCount;
          newObject.needHelpCount = obj.studentLessonProgress.length ? obj.studentLessonProgress.filter((studProg) => studProg.percentCompleted <= 20).length : 0;
          newObject.needHelpPercent = parseInt((newObject.needHelpCount / assignmentCount) * 100);
          newObject.needHelpPercent = newObject.needHelpPercent ? newObject.needHelpPercent : 0;

          newObject.makingProgressCount = obj.studentLessonProgress.length ? obj.studentLessonProgress.filter((studProg) =>
            studProg.percentCompleted > 20 &&
            studProg.percentCompleted < 100
          ).length : 0;
          newObject.makingProgressPercent = parseInt((newObject.makingProgressCount / assignmentCount) * 100);
          newObject.makingProgressPercent = newObject.makingProgressPercent ? newObject.makingProgressPercent : 0;


          newObject.completedCount = obj.studentLessonProgress.length ? obj.studentLessonProgress.filter((studProg) =>
            studProg.percentCompleted == 100 || studProg.endedAt != null
          ).length : 0;
          newObject.completedPercent = parseInt((newObject.completedCount / assignmentCount) * 100);
          newObject.completedPercent = newObject.completedPercent ? newObject.completedPercent : 0;


          newObject.notStartedCount = assignmentCount - (newObject.needHelpCount + newObject.makingProgressCount + newObject.completedCount);
          newObject.notStartedPercent = parseInt((newObject.notStartedCount / assignmentCount) * 100);
          newObject.notStartedPercent = newObject.notStartedPercent ? newObject.notStartedPercent : 0;


          // newObject.skills = obj.studentLessonProgress.length ? obj.studentLessonProgress.map(lessonObj => lessonObj.assign_lesson.lesson.recipe.recipeTechniques).length : 0;

          let standardData = obj.studentLessonProgress
            ? obj.studentLessonProgress.map(
              (stdPrg) => stdPrg.assign_lesson.lesson.questions.length
            )
            : [];
          newObject.standards = standardData.length
            ? standardData.reduce((a, b) => a + b)
            : 0;

          let assessmentData = obj.studentLessonProgress.length
            ? obj.studentLessonProgress.map((lessonObj) => {
              let newObj = {};
              newObj.assignLessonId = lessonObj.assign_lesson.id;
              newObj.lessonId = lessonObj.assign_lesson.lesson.id;
              newObj.studentId = lessonObj.studentId;
              newObj.questionsCount =
                lessonObj.assign_lesson.lesson.questions.length;
              let answerData = obj.studentLessonAnswers.length
                ? obj.studentLessonAnswers.filter(
                  (answerObj) => answerObj.studentId == lessonObj.studentId
                )
                : [];
              newObj.totalMarks = answerData.length
                ? answerData
                  .map((ansObj) => parseFloat(ansObj.pointsEarned))
                  .reduce((a, b) => a + b)
                : 0;
              newObj.marksPercent = parseInt(
                (newObj.totalMarks / newObj.questionsCount) * 100
              );
              return newObj;
            })
            : [];

          let assessmentDataCount = assessmentData.length
            ? assessmentData.length
            : 0;
          let emergingCount = assessmentData.length
            ? assessmentData.filter((marksData) => marksData.marksPercent < 25)
              .length
            : 0;
          let emerging = parseInt((emergingCount / assessmentDataCount) * 100);
          newObject.emerging = emerging ? emerging : 0;

          let proficientCount = assessmentData.length
            ? assessmentData.filter(
              (marksData) =>
                marksData.marksPercent > 24 && marksData.marksPercent < 76
            ).length
            : 0;
          let proficient = parseInt(
            (proficientCount / assessmentDataCount) * 100
          );
          newObject.proficient = proficient ? proficient : 0;

          let advancedCount = assessmentData.length
            ? assessmentData.filter((marksData) => marksData.marksPercent > 75)
              .length
            : 0;
          let advanced = parseInt((advancedCount / assessmentDataCount) * 100);
          newObject.advanced = advanced ? advanced : 0;

          if (assessmentDataCount == 0) newObject.emerging = 100;
          return newObject;
        }
      });

      return utils.responseGenerator(
        StatusCodes.OK,
        "Student report data fetched",
        processedData
      );
    } catch (err) {
      throw err;
    }
  },

  getReportByAssignment: async (req, user_id) => {
    const assignmentIds = JSON.parse(req.query.assignmentIds);
    const filter = {};
    if (req.query.classId) filter.classId = req.query.classId;

    try {
      let assignmentData = await AssignLesson.findAll({
        attributes: [
          "id",
          "assignmentTitle",
          "lessonId",
          "classId",
          "startDate",
          "endDate",
        ],
        where: {
          id: { [Op.in]: assignmentIds },
          deletedAt: null,
        },
        include: [
          {
            model: Class,
            attributes: ["id", "grade_id"],
          },
          {
            model: StudentLessonProgress,
            attributes: [
              "id",
              "assignLessonId",
              "studentId",
              "percentCompleted",
              "startedAt",
              "endedAt",
            ],
            as: "studentProgressList",
          },
        ],
      });
      assignmentData = JSON.parse(JSON.stringify(assignmentData));
      const totalStudentCount = await ClasStudent.count({ where: filter });
      assignmentData.map((obj) => {
        (obj.needHelpCount = obj.studentProgressList.filter(
          (studProg) => studProg.percentCompleted <= 20
        ).length),
          (obj.makingProgressCount = obj.studentProgressList.filter(
            (studProg) =>
              studProg.percentCompleted > 20 && studProg.percentCompleted < 100
          ).length),
          (obj.completedCount = obj.studentProgressList.filter(
            (studProg) =>
              studProg.percentCompleted == 100 || studProg.endedAt != null
          ).length);
        obj.notStartedCount =
          totalStudentCount -
          (obj.needHelpCount + obj.makingProgressCount + obj.completedCount);
        return obj;
      });

      return utils.responseGenerator(
        StatusCodes.OK,
        "Assigned lessons fetched",
        assignmentData
      );
    } catch (err) {
      throw err;
    }
  },

  classReportByStandard: async (req, param_id, user_id) => {
    const filter = {};
    param_id ? (filter.classId = param_id) : null;
    try {
      let StudentCount = await ClasStudent.count({ where: { ...filter } });
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
      let assignmentQuestionsData = await AssignLesson.findAll({
        attributes: ["id", "lesson_id", "classId"],
        where: {
          ...filter, deletedAt: null
        },
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
        where: { ...filter },
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

      if (assignmentQuestionsData.length != 0) {
        assignmentQuestionsData = JSON.parse(
          JSON.stringify(assignmentQuestionsData)
        );
      }

      StudentsAnswersData = JSON.parse(JSON.stringify(StudentsAnswersData));


      let assessment = (key, type) => {
        let questionArray;
        let questionCount;

        questionArray = assignmentQuestionsData.map(
          (obj) =>
            obj.lesson.questions.filter(
              (quesObj) => quesObj.questionType.key == key
            ).length
        );
        questionCount = questionArray.length
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
            (totalAnswerCount / StudentAnsweredCount) / (StudentCount * questionCount) * 100;
          if (stduentAnswerPercent != NaN && stduentAnswerPercent != Infinity) {
            return stduentAnswerPercent ? parseInt(stduentAnswerPercent) : 0;
          }
          return 0;
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
          obj.totalCorrectAnswerCount = answerArray.length ? answerArray.reduce((a, b) => a + b) : 0;
          obj.studentAnsweredCount = answerArray.filter(
            (index) => index !== 0
          ).length;
          obj.correctAnswerPercent =
            ((obj.totalCorrectAnswerCount / obj.studentAnsweredCount) / (StudentCount * questionCount)) * 100;

          if (
            obj.correctAnswerPercent != NaN &&
            obj.correctAnswerPercent != Infinity
          ) {
            return obj.correctAnswerPercent
              ? parseInt(obj.correctAnswerPercent)
              : 0;
          }
          return 0;
        }
      };
      let attempted = [
        assessment("ela", "1"),
        assessment("math", "1"),
        assessment("ngss", "1"),
        assessment("ncss", "1"),
      ];
      let proficiency = [
        assessment("ela", "2"),
        assessment("math", "2"),
        assessment("ngss", "2"),
        assessment("ncss", "2"),
      ];

      return utils.responseGenerator(
        StatusCodes.OK,
        "Report fetched successfully",
        { attempted, proficiency }
      );
    } catch (err) {
      throw err;
    }
  },

  getReportByAssignmentId: async (param_id, user_id) => {
    const filter = {};
    if (param_id) filter.id = param_id;
    if (user_id) filter.createdBy = user_id;

    try {
      let assignmentData = await AssignLesson.findOne({
        attributes: [
          "id",
          "assignmentTitle",
          "lessonId",
          "classId",
          "startDate",
          "endDate",
        ],
        where: { ...filter, deletedAt: null },
        include: [
          {
            model: Class,
            attributes: ["id", "grade_id"],
            include: [
              {
                model: ClasStudent,
                attributes: ["id", "classId", "studentId"],
                include: [
                  {
                    model: Student,
                    attributes: ["id", "firstName", "lastName"],
                    include: [
                      {
                        model: StudentLessonProgress,
                        attributes: [
                          "id",
                          "assignLessonId",
                          "studentId",
                          "percentCompleted",
                          "startedAt",
                          "endedAt",
                        ],
                        where: { assignLessonId: param_id },
                        as: "studentLessonProgress",
                        required: false,
                      },
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
                        where: { assignLessonId: param_id },
                        as: "studentLessonAnswers",
                        required: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      assignmentData = JSON.parse(JSON.stringify(assignmentData));
      let questionCount = await Question.count({
        where: { transactionId: assignmentData.lessonId },
      });

      let processedData = [];
      assignmentData.class.class_students.map((classStud) => {
        let myObj = {};
        myObj.id = classStud.student.id;
        myObj.assignmentId = param_id;
        myObj.firstName = classStud.student.firstName;
        myObj.lastName = classStud.student.lastName;
        myObj.startDate = classStud.student.studentLessonProgress.length
          ? classStud.student.studentLessonProgress[0].startedAt
          : null;
        myObj.endDate = classStud.student.studentLessonProgress.length
          ? classStud.student.studentLessonProgress[0].endedAt
          : null;
        let progressData = classStud.student.studentLessonProgress;
        if (progressData.length) {
          progressData = progressData[0];
          if (progressData.percentCompleted <= 20) myObj.staus = "Need Help";
          if (
            progressData.percentCompleted > 20 &&
            progressData.percentCompleted < 100
          )
            myObj.status = "Making Progress";
          if (
            progressData.percentCompleted == 100 ||
            progressData.endedAt != null
          )
            myObj.status = "Completed";
        } else {
          myObj.status = "Not Started";
        }

        let studentLessonAnswers = classStud.student.studentLessonAnswers;
        let marksArray = studentLessonAnswers.map((obj) =>
          parseFloat(obj.pointsEarned)
        );
        let totalMarks = marksArray.length
          ? marksArray.reduce((a, b) => a + b)
          : 0;
        let marksPercent = parseInt((totalMarks / questionCount) * 100);

        if (!isNaN(marksPercent)) {
          if (marksPercent < 25) myObj.proficiency = "Emerging";
          if (marksPercent > 25 && marksPercent < 75)
            myObj.proficiency = "Proficient";
          if (marksPercent > 75) myObj.proficiency = "Advanced";
        }
        processedData.push(myObj);
      });

      return utils.responseGenerator(
        StatusCodes.OK,
        "Assigned lessons fetched",
        processedData
      );
    } catch (err) {
      throw err;
    }
  },

  getStudentReport: async (req, param_id) => {
    try {
      //fitler
      const filter = {};
      if (!param_id)
        return utils.responseGenerator(
          StatusCodes.BAD_REQUEST,
          "Student id missing"
        );
      if (!req.query.assignLessonId)
        return utils.responseGenerator(
          StatusCodes.BAD_REQUEST,
          "Assignment id missing"
        );

      const data = {};
      //// fetch progress
      {
        const progress = await StudentLessonProgress.findOne({
          where: {
            studentId: param_id,
            assignLessonId: req.query.assignLessonId,
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
      {
        const orderedSteps = [
          "story",
          "cooking",
          "learning activities",
          "assessments",
        ];
        const assignLesson = await AssignLesson.findOne({
          where: { id: req.query.assignLessonId },
        });
        let steps;
        if (assignLesson.selfAssignedBy) {
          steps = orderedSteps;
        } else {
          const { content } = await LessonSetting.findOne({
            include: [
              {
                association: "assign_lesson",
                where: { id: req.query.assignLessonId },
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
      }
      //// fetch questions answered
      {
        let totalAnswer = 0;
        let correctAnswer = 0;
        data.questionsAnswered = [];

        const items = await StudentLessonAnswer.findAll({
          where: {
            studentId: param_id,
            assignLessonId: req.query.assignLessonId,
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

      return utils.responseGenerator(
        StatusCodes.OK,
        "Report fetched successfully",
        data
      );
    } catch (err) {
      throw err;
    }
  },

  stduentAnswerCheck: async (reqBody, user_id) => {
    try {
      if (reqBody.isCorrect) reqBody.pointsEarned = 1;
      else reqBody.pointsEarned = 0;
      let answerUpdate = await StudentLessonAnswer.update(
        {
          isCorrect: reqBody.isCorrect,
          pointsEarned: reqBody.pointsEarned,
          updatedBy: user_id,
        },
        {
          where: {
            studentId: reqBody.studentId,
            assignLessonId: reqBody.assignLessonId,
            questionId: reqBody.questionId,
          },
        }
      );
      return utils.responseGenerator(
        StatusCodes.OK,
        "Question status updated",
        answerUpdate
      );
    } catch (err) {
      throw err;
    }
  },
  studentAboveAndBelowAverageActivity: async (req, param_id) => {
    const filter = {};
    if (param_id) {
      const { entityId, entityType, isSubUser, parentEntityId } = await modelHelper.entityDetails(param_id);
      if (entityType == "district" && !isSubUser) filter.district_id = entityId;
      else if (entityType == "district" && isSubUser) filter.district_id = parentEntityId;
      else if (entityType == "school" && !isSubUser) filter.school_id = entityId;
      else if (entityType == "school" && isSubUser) filter.school_id = parentEntityId;
    }

    const filter1 = {};
    if (req.query.duration) {

      var today = new Date();
      var priorDate = new Date();
      if (req.query.duration == "week")
        filter1.startDate = {
          [Op.between]: [
            new Date(priorDate.setDate(priorDate.getDate() - 7)),
            today,
          ],
        };
      if (req.query.duration == "month")
        filter1.startDate = {
          [Op.between]: [
            new Date(priorDate.setDate(priorDate.getDate() - 30)),
            today,
          ],
        };
      if (req.query.duration == "quarter")
        filter1.startDate = {
          [Op.between]: [
            new Date(priorDate.setDate(priorDate.getDate() - 120)),
            today,
          ],
        };
      if (req.query.duration == "year")
        filter1.startDate = {
          [Op.between]: [
            new Date(priorDate.setDate(priorDate.getDate() - 365)),
            today,
          ],
        };
      if (param_id) filter1.classId = param_id;
    }

    try {
      const roleId = (await Role.findOne({ where: { title: "Student" } })).id;

      const classDetails = await Class.findAll({
        where: filter,
        attributes: ["id"]
      })

      classIds = classDetails.map((obj) => obj.id)

      let studentData = await ClasStudent.findAll({
        attributes: ["id", "studentId", "classId"],
        where: {
          classId: classIds
        },
        include: [
          {
            model: Student,
            attributes: ["id", "firstName", "lastName"],
            include: [
              {
                model: StudentSession,
                attributes: ["id", "roleId", "entityId", "sessionMins"],
                where: {
                  roleId: roleId, createdAt: {
                    [Op.between]: [
                      new Date(priorDate.setDate(priorDate.getDate() - 7)),
                      today,
                    ],
                  }
                },
                as: "studentSessionData",
                required: false
              },
            ],
          },
        ],
      });

      studentData = JSON.parse(JSON.stringify(studentData));
      let totalStudents = studentData.length;
      let processData = studentData.map(obj => {
        let newObj = {};
        newObj.StudentId = obj.studentId;
        if (obj.student.studentSessionData.length === 0) newObj.studentSessionHour = 0;
        else {
          let sessionData = obj.student.studentSessionData.filter(sessionObj => sessionObj.sessionMins !== null);
          let studentSessionHour = sessionData.map(timeObj => timeObj.sessionMins);
          newObj.studentSessionHour = studentSessionHour.length ? parseFloat(studentSessionHour.reduce((a, b) => a + b) / (7 * 60)).toFixed(2) : 0;
        }
        return newObj;
      });

      let finalObj = {};
      let sessionDataList = processData.map(obj => parseFloat(obj.studentSessionHour));
      finalObj.totalAverageHour = sessionDataList.length ? (sessionDataList.reduce((a, b) => a + b) / (totalStudents)).toFixed(2) : 0;
      finalObj.belowAverageCount = processData.filter(obj => obj.StudentSessionHour <= finalObj.totalAverageHour).length;
      finalObj.belowAveragePercent = (finalObj.belowAverageCount / totalStudents) * 100;

      finalObj.aboveAverageCount = processData.filter(obj => obj.StudentSessionHour > finalObj.totalAverageHour).length;
      finalObj.aboveAveragePercent = (finalObj.aboveAverageCount / totalStudents) * 100;

      finalObj.inactiveStudentCount = totalStudents - (finalObj.belowAverageCount + finalObj.aboveAverageCount);
      finalObj.inactiveStudentPercent = (finalObj.inactiveStudentCount / totalStudents) * 100;

      // return utils.responseGenerator(StatusCodes.OK, "Session data fetched", { studentData, processData, totalStudents, finalObj });
      return utils.responseGenerator(StatusCodes.OK, "Session data fetched", finalObj);

    } catch (err) {
      throw err;
    }
  },
  dashboardTimeSpent: async (param_id, user_id) => {
    const filter = {};
    param_id ? (filter.classId = param_id) : null;

    try {

      const roleId = (await Role.findOne({ where: { title: "Student" } })).id;

      let today = new Date();
      let priorDate = new Date();

      let studentData = await ClasStudent.findAll({
        attributes: ["id", "studentId", "classId"],
        where: { ...filter },
        include: [
          {
            model: Student,
            attributes: ["id", "firstName", "lastName"],
            include: [
              {
                model: StudentSession,
                attributes: ["id", "roleId", "entityId", "sessionMins"],
                where: {
                  roleId: roleId, createdAt: {
                    [Op.between]: [
                      new Date(priorDate.setDate(priorDate.getDate() - 7)),
                      today,
                    ],
                  }
                },
                as: "studentSessionData",
                required: false
              },
            ],
          },
        ],
      });

      studentData = JSON.parse(JSON.stringify(studentData));
      let totalStudents = studentData.length;
      let processData = studentData.map(obj => {
        let newObj = {};
        newObj.StudentId = obj.studentId;
        if (obj.student.studentSessionData.length === 0) newObj.studentSessionHour = 0;
        else {
          let sessionData = obj.student.studentSessionData.filter(sessionObj => sessionObj.sessionMins !== null);
          let studentSessionHour = sessionData.map(timeObj => timeObj.sessionMins);
          newObj.studentSessionHour = studentSessionHour.length ? parseFloat(studentSessionHour.reduce((a, b) => a + b) / (7 * 60)).toFixed(2) : 0;
        }
        return newObj;
      });

      let finalObj = {};
      let sessionDataList = processData.map(obj => parseFloat(obj.studentSessionHour));
      finalObj.totalAverageHour = sessionDataList.length ? (sessionDataList.reduce((a, b) => a + b) / (totalStudents)).toFixed(2) : 0;
      finalObj.belowAverageCount = processData.filter(obj => obj.StudentSessionHour <= finalObj.totalAverageHour).length;
      finalObj.belowAveragePercent = (finalObj.belowAverageCount / totalStudents) * 100;

      finalObj.aboveAverageCount = processData.filter(obj => obj.StudentSessionHour > finalObj.totalAverageHour).length;
      finalObj.aboveAveragePercent = (finalObj.aboveAverageCount / totalStudents) * 100;

      finalObj.inactiveStudentCount = totalStudents - (finalObj.belowAverageCount + finalObj.aboveAverageCount);
      finalObj.inactiveStudentPercent = (finalObj.inactiveStudentCount / totalStudents) * 100;

      // return utils.responseGenerator(StatusCodes.OK, "Session data fetched", { studentData, processData, totalStudents, finalObj });
      return utils.responseGenerator(StatusCodes.OK, "Session data fetched", finalObj);

    } catch (err) {
      throw err;
    }
  }

};
