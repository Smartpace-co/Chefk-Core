const express = require("express");
const router = express.Router();
let { StatusCodes } = require("http-status-codes");
let utils = require("./helpers/utils");

// Middlewares
const authenticateToken = require("./middleware/authenticateToken");
const joiValidator = require("./middleware/joiValidator");

// Controllers
const helperController = require("./controllers/helperController");
const districtAdminController = require("./controllers/districtAdminController");
const authController = require("./controllers/authController");
const roleController = require("./controllers/roleController");
const accessModuleController = require("./controllers/accessModuleController");
const districtUserController = require("./controllers/districtUserController");
const schoolController = require("./controllers/schoolController");
const teacherController = require("./controllers/teacherController");
const classController = require("./controllers/classController");
const classReportController = require("./controllers/classReportController");
const masterController = require("./controllers/masterController");
const studentController = require("./controllers/studentController");
const settingController = require("./controllers/settingController");
const reportIssueController = require("./controllers/reportIssueController");
const recipeController = require("./controllers/recipeController");
const lessonsController = require("./controllers/lessonsController");
const commentController = require("./controllers/commentController");
const discussionForumController = require("./controllers/discussionForumController");
const replyController = require("./controllers/replyController");
const issuesfeedbackController = require("./controllers/issueFeedbackController");
const paymentController = require("./controllers/paymentController");
const assignmentController = require("./controllers/assignmentsController");
const subscribePackageController = require("./controllers/subscribePackageController");
const voteController = require("./controllers/voteController");
const studentJournalController = require("./controllers/studentJournalController");
const studentStatsController = require("./controllers/studentStatsController");
const miniGameController = require("./controllers/miniGameController");
const notificationController = require("./controllers/notificationController");


// Joi Schema
const districtSchema = require("./joiSchema/district.Schema");
const districtUserSchema = require("./joiSchema/districtUser.Schema");
const authSchema = require("./joiSchema/auth.Schema");
const roleSchema = require("./joiSchema/role.Schema");
const schoolSchema = require("./joiSchema/school.Schema");
const teacherSchema = require("./joiSchema/teacher.Schema");
const classSchema = require("./joiSchema/class.Schema");
const studentSchema = require("./joiSchema/student.Schema");
const lessonSchema = require("./joiSchema/lesson.Schema");
const studentJournalSchema = require("./joiSchema/studentJournal.Schema");
const studentStatsSchema = require("./joiSchema/studentStats.Schema");
const classReportSchema = require("./joiSchema/classReport.Schema");

const schoolUserController = require("./controllers/schoolUserController");
const studentService = require("./service/studentService");
const settingService = require("./joiSchema/setting.Schema");

// ****************** Ping ****************************

router.get("/", (req, res) => {
  res.status(StatusCodes.OK).send(utils.responseGenerator(StatusCodes.OK, "ping success"));
});
// ****************** Manage helper endpoints ****************************
router.post("/helper/checkEmailConflict", helperController.checkEmailConflict);
router.post("/helper/checkPhoneNumberConflict", helperController.checkPhoneNumberConflict);
router.post("/fileUpload", authenticateToken, helperController.fileUpload);
router.get("/demoFile/:entityType", authenticateToken, helperController.getDemoFile);

// ****************** Manage District Admin ****************************
router.post(
  "/districtAdmin/registration",
  authenticateToken,
  joiValidator(districtSchema.create),
  districtAdminController.createDistrictAdmin
);
router.get("/districtAdmin/profile/", authenticateToken, districtAdminController.getDistrictAdminProfile);
router.put(
  "/districtAdmin/profile/",
  authenticateToken,
  joiValidator(districtSchema.update),
  districtAdminController.updateDistrictAdminProfile
);
router.get("/districts", districtAdminController.getAllDistricts); //school registration get districts
router.get("/districtAdmin", authenticateToken, districtAdminController.getAllDistrictAdmins);

router.get("/district/profile/:id", authenticateToken, districtAdminController.getDistrictAdmin);
router.put(
  "/district/profile/:id",
  authenticateToken,
  joiValidator(districtSchema.update),
  districtAdminController.updateDistrictProfile
);

router.delete("/districtAdmin/:id", authenticateToken, districtAdminController.deleteDistrictAdmin);

// ****************** Manage Auth ****************************
router.get("/guestToken", authController.getGuestToken);
router.post("/login", joiValidator(authSchema.login), authController.login);
router.post("/studentLogin", joiValidator(authSchema.studentLogin), authController.studentLogin);
router.post(
  "/forgotPassword/validateEmail",
  joiValidator(authSchema.forgotPassword),
  authController.forgotPasswordValidateEmail
);
router.post(
  "/studentForgotPassword/validateEmail",
  joiValidator(authSchema.studentForgotPassword),
  authController.studentForgotPasswordValidateEmail
);
router.put("/resetPassword/:token", joiValidator(authSchema.resetPassword), authController.resetPassword);
router.get("/userByToken", authenticateToken, authController.getUserByToken);
router.put(
  "/changePassword",
  authenticateToken,
  joiValidator(authSchema.changePassword),
  authController.changePassword
);
router.post("/logout", authenticateToken, authController.logout);
router.get("/topActiveSessionTeachers", authenticateToken, authController.topActiveSessionTeachers);
router.get("/topActiveSessionStudents", authenticateToken, authController.topActiveSessionStudents);

// ****************** Manage Access Module ****************************
router.get("/accessmodule", authenticateToken, accessModuleController.getAllAccessModules);
router.get("/accessmodule/:id", authenticateToken, accessModuleController.getAccessModulesByRoleId);

// ****************** Manage Roles ****************************
router.post(
  "/checkRoleNameConflict",
  authenticateToken,
  joiValidator(roleSchema.nameConflict),
  roleController.checkRoleNameConflict
);
router.post("/role", authenticateToken, joiValidator(roleSchema.create), roleController.createRole);
router.get("/masterrole", roleController.getAllMasterRoles); 
router.get("/masterrole/:id", roleController.getMasterRole); 
router.get("/role", authenticateToken, roleController.getAllRoles);
router.get("/role/:id", authenticateToken, roleController.getRole);
router.get("/userrole/:id", authenticateToken, roleController.getUserRole);

router.put("/role/:id", joiValidator(roleSchema.update), authenticateToken, roleController.updateRole);
router.delete("/role/:id", authenticateToken, roleController.deleteRole);

// ****************** Manage District User ****************************
router.post(
  "/districtUser/",
  authenticateToken,
  joiValidator(districtUserSchema.create),
  districtUserController.createDistrictUser
);
router.get("/districtUser/", authenticateToken, districtUserController.getAllDistrictUsers);
router.get("/districtUser/profile", authenticateToken, districtUserController.getDistrictUserProfile);
router.get("/districtUser/:id", authenticateToken, districtUserController.getDistrictUser);
router.put(
  "/districtUser/profile",
  authenticateToken,
  joiValidator(districtUserSchema.update),
  districtUserController.updateDistrictUserProfile
);
router.put(
  "/districtUser/:id",
  authenticateToken,
  joiValidator(districtUserSchema.update),
  districtUserController.updateDistrictUser
);
router.post(
  "/districtUser/file",
  authenticateToken,
  joiValidator(districtUserSchema.file),
  districtUserController.createDistrictUserFromFile
);
// districtUser profile

// router.get("/districtAdmin/profile/", authenticateToken, districtAdminController.getDistrictAdminProfile);
// router.put("/districtAdmin/profile/", authenticateToken, districtAdminController.updateDistrictAdminProfile);

// ****************** Manage School ****************************
router.post(
  "/checkSchoolNameConflict",
  authenticateToken,
  joiValidator(schoolSchema.nameConflict),
  schoolController.checkSchoolNameConflict
);

router.get("/schoolById", schoolController.getSchoolById);

router.post("/school", authenticateToken, joiValidator(schoolSchema.create), schoolController.createSchool);
router.get("/school", authenticateToken, schoolController.getAllSchools);
router.get("/school/:id", authenticateToken, schoolController.getSchool);

router.put("/school/:id", authenticateToken, joiValidator(schoolSchema.update), schoolController.updateSchool);

// router.post("/schoolAdmin", authenticateToken, joiValidator(schoolSchema.create), schoolController.createSchoolAdmin);

router.get("/schoolDetails/:id", authenticateToken, schoolController.getSchoolByUserId);

router.delete("/school/:id", authenticateToken, schoolController.deleteSchool);

// ****************** Manage Teacher ****************************

router.post("/teacher", authenticateToken, joiValidator(teacherSchema.create), teacherController.createTeacher);
router.post(
  "/teacher/file",
  authenticateToken,
  joiValidator(teacherSchema.file),
  teacherController.createTeacherFromFile
);
router.get("/teacher", authenticateToken, teacherController.getAllTeachers);
router.get("/teacher/:id", authenticateToken, teacherController.getTeacher);
router.put("/teacher/:id", authenticateToken, joiValidator(teacherSchema.update), teacherController.updateTeacher);
router.get("/teacher/classGroup/:id", authenticateToken, teacherController.getGroupsByClass);
router.get("/teacher/groupName/:id", authenticateToken, teacherController.getGroupNames);
router.get("/teacher/nonGroupStudents/:id", authenticateToken, teacherController.getNonGroupStudents);

router.post(
  "/teacher/classGroup",
  authenticateToken,
  joiValidator(teacherSchema.addGroup),
  teacherController.createGroup
);
router.put(
  "/teacher/classGroup/:id",
  authenticateToken,
  joiValidator(teacherSchema.editGroup),
  teacherController.editGroup
);
router.delete("/teacher/classGroup/:id", authenticateToken, teacherController.deleteGroup);
router.post(
  "/checkColorAndTitleConflict",
  authenticateToken,
  joiValidator(teacherSchema.colorTitleConflict),
  teacherController.checkColorAndTitleConflict
);

// ****************** Manage Class ****************************
router.post(
  "/checkClassNameConflict",
  authenticateToken,
  joiValidator(classSchema.nameConflict),
  classController.checkClassNameConflict
);
router.post("/class", authenticateToken, joiValidator(classSchema.create), classController.createClass);

router.get("/classBySchool/:schoolId", authenticateToken, classController.getClassesBySchool);
router.get("/class", authenticateToken, classController.getAllClasses);
router.get("/class/:id", authenticateToken, classController.getClass);
router.put("/class/:id", authenticateToken, joiValidator(classSchema.update), classController.updateClass);
router.put("/class/archive/:id", authenticateToken, classController.archiveClass);
router.put("/class/unArchive/:id", authenticateToken, classController.unArchiveClass);
router.delete("/class/delete/:id", authenticateToken, classController.deleteClass);

router.post("/class/joinClass", authenticateToken, joiValidator(classSchema.joinClass), classController.joinClass);
router.get("/count/class", authenticateToken, classController.getClassCount);
router.get("/deleted/class", authenticateToken, classController.getAllDeletedClasses);

//************************** Manage class report **********************
router.get("/teacherDashboard/needHelpStudents/:id", authenticateToken, classReportController.dashboardNeedHelp);
router.get("/teacherDashboard/practiceAndGrowth/:id", authenticateToken, classReportController.dashboardGraphData);
router.get("/teacherDashboard/dashboardTimeSpent/:id", authenticateToken, classReportController.dashboardTimeSpent);

router.get("/report/category/:id", authenticateToken, classReportController.getReportCategories);
router.get("/report/reportByStandard", authenticateToken, classReportController.getReportByStandard);

router.get("/report/byAssignment", authenticateToken, classReportController.getReportByAssignment);
router.get("/report/byAssignment/:id", authenticateToken, classReportController.getReportByAssignmentId);

router.get("/report/byStudent/:id", authenticateToken, classReportController.studentReportByClass);

router.get("/report/studentReport/:id", authenticateToken, classReportController.getStudentReport);

router.get("/report/studentStandardReport", authenticateToken, classReportController.getStudentStandardReport);

router.put("/report/updateAnswer", authenticateToken, joiValidator(classReportSchema.answerUpdate), classReportController.stduentAnswerCheck);

// ****************** Manage Student ****************************
router.post(
  "/checkUserNameConflict",
  authenticateToken,
  joiValidator(studentSchema.userNameConflict),
  studentController.checkUserNameConflict
);
router.post("/student", authenticateToken, joiValidator(studentSchema.create), studentController.createStudent);
router.post(
  "/student/file",
  authenticateToken,
  joiValidator(studentSchema.file),
  studentController.createStudentFromFile
);
router.get("/student", authenticateToken, studentController.getAllStudents);
router.get("/count/student", authenticateToken, studentController.getStudentCount);
  // ****************** Manage Student Journal ****************************
{
  router.get("/student/dashboardStats", authenticateToken, studentStatsController.dashboardStats);
  router.post(
    "/student/journal",
    authenticateToken,
    joiValidator(studentJournalSchema.create),
    studentJournalController.createJournal
  );
  router.get("/student/journal", authenticateToken, studentJournalController.getJournal);
  router.get("/student/journalNotes/:id", authenticateToken, studentJournalController.getJournalNotes);

  router.put(
    "/student/journal",
    authenticateToken,
    joiValidator(studentJournalSchema.update),
    studentJournalController.updateJournal
  );

  router.put(
    "/student/journal/archive",
    authenticateToken,
    joiValidator(studentJournalSchema.archive),
    studentJournalController.archiveJournal
  );
  router.put(
    "/student/journal/unArchive",
    authenticateToken,
    joiValidator(studentJournalSchema.unArchive),
    studentJournalController.unArchiveJournal
  );
}
// ****************** Manage Student Stats ****************************
{
  router.post(
    "/student/lesson/progress",
    authenticateToken,
    joiValidator(studentStatsSchema.createLessonProgress),
    studentStatsController.createLessonProgress
  );
  router.get("/student/lesson/progress/:assignLessonId", authenticateToken, studentStatsController.getLessonProgress);
  router.put(
    "/student/lesson/progress/:assignLessonId",
    authenticateToken,
    joiValidator(studentStatsSchema.updateLessonProgress),
    studentStatsController.updateLessonProgress
  );
  router.post(
    "/student/lesson/answer",
    authenticateToken,
    joiValidator(studentStatsSchema.createLessonAnswer),
    studentStatsController.createLessonAnswer
  );
  router.get("/student/lesson/answer/:assignLessonId", authenticateToken, studentStatsController.getLessonAnswer);
  router.post(
    "/student/lesson/rating",
    authenticateToken,
    joiValidator(studentStatsSchema.addLessonRating),
    studentStatsController.addLessonRating
  );
  router.get("/student/lesson/report/:id", authenticateToken, studentStatsController.getLessonReport);
  router.get("/student/process/stampsEarned", authenticateToken, studentStatsController.processStampsEarned);
  router.get("/student/passport", authenticateToken, studentStatsController.getPassport);
  router.get("/student/achievement", authenticateToken, studentStatsController.getAchievements);
  router.post(
    "/student/item",
    authenticateToken,
    joiValidator(studentStatsSchema.addItemEarned),
    studentStatsController.addItemEarned
  );
  router.get("/student/item", authenticateToken, studentStatsController.getLockerItems);
  router.post(
    "/student/healthHygiene",
    authenticateToken,
    joiValidator(studentStatsSchema.addHealthHygiene),
    studentStatsController.addHealthHygiene
  );
  router.get("/student/healthHygiene/:id", authenticateToken, studentStatsController.getHealthHygiene);
}
router.get("/student/:id", authenticateToken, studentController.getStudent);
router.put("/student/:id", authenticateToken, joiValidator(studentSchema.update), studentController.updateStudent);
router.get("/student/class/:id", authenticateToken, studentController.getStudentsByclassId);

// ****************** Master Services ****************************
router.get("/master/grade", masterController.getAllGrades);
router.get("/master/standard", masterController.getAllStandards);
router.get("/master/ethnicity", authenticateToken, masterController.getAllEthnicities);
router.get("/master/relation", authenticateToken, masterController.getAllRelations);
router.get("/master/medicalcondition", authenticateToken, masterController.getAllMedicalConditions);
router.get("/master/faqs", authenticateToken, masterController.getAllFAQs);
router.get("/master/contactus", authenticateToken, masterController.getAllHelpContacts);
router.get("/master/subject", authenticateToken, masterController.getAllSubjects);
router.get("/master/systemLanguage", authenticateToken, masterController.getAllSystemLanguages);
router.get("/master/groupcolors", masterController.getAllGroupColors);
router.get("/master/allergen", authenticateToken, masterController.getAllAllergens);
router.get("/master/language", masterController.getAllLanguages);
router.get("/master/country", masterController.getAllCountries);
router.get("/master/ingredient", masterController.getAllIngredients);
router.get("/master/culinaryTechniques", masterController.getAllICulinaryTechniques);
router.get("/master/lessonFilters", masterController.getAllFiltersList);

// ****************** Manage School User ****************************
router.get("/schoolUser/", authenticateToken, schoolUserController.getAllSchoolUsers);
router.post(
  "/schoolUser/",
  authenticateToken,
  joiValidator(districtUserSchema.create),
  schoolUserController.createSchoolUser
);
router.get("/schoolUser/", authenticateToken, schoolUserController.getAllSchoolUsers);
router.get("/schoolUser/profile", authenticateToken, schoolUserController.getSchoolUserProfile);
router.get("/schoolUser/:id", authenticateToken, schoolUserController.getSchoolUser);
router.put(
  "/schoolUser/profile",
  authenticateToken,
  joiValidator(districtUserSchema.update),
  schoolUserController.updateSchoolUserProfile
);
router.put(
  "/schoolUser/:id",
  authenticateToken,
  joiValidator(districtUserSchema.update),
  schoolUserController.updateSchoolUser
);
router.post(
  "/schoolUser/file",
  authenticateToken,
  joiValidator(districtUserSchema.file),
  schoolUserController.createSchoolUserFromFile
);

// ****************** Manage Setting ****************************
router.get("/settings/:entityId", authenticateToken, settingController.getSettings);
router.get("/settings/preferedLanguage/:entityId", authenticateToken, settingController.getPreferedLanguage);
router.put("/settings", authenticateToken, joiValidator(settingService.update), settingController.updateSettings);

//********************Report Issues**********************

//********************Report Issues**********************

router.post("/reportIssue", authenticateToken, reportIssueController.createReportIssue);
router.get("/reportIssue/:id", authenticateToken, reportIssueController.getReportIssueByUserId);
router.get("/reportIssue/report/:id", authenticateToken, reportIssueController.getReportIssueById);

// ******************* Manage Recipe ********************************
router.get("/recipe", authenticateToken, recipeController.getAllRecipies);

// ******************* Manage lessons ********************************

router.post(
  "/lessonTitleConflict",
  authenticateToken,
  joiValidator(lessonSchema.nameConflict),
  lessonsController.checkNameConflict
);

router.get("/lesson/customSettingList", authenticateToken, lessonsController.customSettingList);
router.get("/lesson/topRated", authenticateToken, lessonsController.getTopRatedLessons);
router.get("/lesson/standard", authenticateToken, lessonsController.getStandardList);
router.get("/lesson/standardLessons", authenticateToken, lessonsController.getStandardLessons);
router.get("/lesson/find", authenticateToken, lessonsController.getSearchLessons);

router.get("/lesson", authenticateToken, lessonsController.getAllLessons);
router.get("/lessonById/:id", authenticateToken, lessonsController.getLessonById);
router.get("/lessonInfo/:id", authenticateToken, lessonsController.getLessonInfoData);

// router.get("/lesson/:id", authenticateToken, lessonsController.getLessonData);

// router.get("/getFilterLessons", authenticateToken, lessonsController.getFilterLessons);

router.post("/lesson/assign", authenticateToken, joiValidator(lessonSchema.assign), lessonsController.assignLesson);
router.put(
  "/lesson/bookmark/:id",
  authenticateToken,
  joiValidator(lessonSchema.bookmark),
  lessonsController.bookmarkLesson
);

router.get("/assignment", authenticateToken, assignmentController.getAllAssignments);
router.put("/assignment/archive/:id", authenticateToken, assignmentController.archiveAssignment);
router.put("/assignment/unArchive/:id", authenticateToken, assignmentController.unArchiveAssignment);

router.get("/assignment/teacherInstruction/:lessonId", authenticateToken, assignmentController.getTeacherInstruction);
router.get("/assignment/recipeIngredients/:assignmentId", authenticateToken, assignmentController.getRecipeIngredients);
router.get("/assignment/substitue/:id", authenticateToken, assignmentController.getSubstitueList);

router.put(
  "/assignment/:id",
  authenticateToken,
  joiValidator(lessonSchema.updateAssignment),
  assignmentController.updateAssignment
);
router.delete("/assignment/:id", authenticateToken, assignmentController.deleteAssignment);

router.get("/lesson/assigned", authenticateToken, lessonsController.getAllAssignedLessons);
router.get("/lesson/assignedRecipeTitle/:id", authenticateToken, lessonsController.getAssignedRecipeTitle);
router.get("/lesson/assigned/:id", authenticateToken, lessonsController.getAssignedLesson);
router.get("/lesson/:id", authenticateToken, lessonsController.getLesson);
router.post(
  "/lesson/selfassign",
  authenticateToken,
  joiValidator(lessonSchema.selfAssign),
  lessonsController.selfAssignLesson
);
// ****************** Manage payments ****************************

router.post("/payment/session", authenticateToken, paymentController.createSession);
router.post("/payment/charge", authenticateToken, paymentController.chanrgePayment);
router.get("/payment/:id", authenticateToken, paymentController.getPaymentDetails);

//******************** Manage Comments ****************************** */

router.post("/comments", authenticateToken, commentController.createComment);
router.get("/comments", authenticateToken, commentController.getAllComment);
router.get("/comments/:id", authenticateToken, commentController.getCommentById);
router.delete("/comments/:id", authenticateToken, commentController.updateCommentStatus);

//*************************Manage Discussion Forum********************** */

router.post("/discussionForum", authenticateToken, discussionForumController.createDiscussionforum);
router.get("/discussionForum", authenticateToken, discussionForumController.getAllDiscussionforum);
router.get("/discussionForum/:id", authenticateToken, discussionForumController.getDiscussionforumById);

router.put("/vote/:id", authenticateToken, discussionForumController.updateVote);

//*********************** Manage Reply**********************************/

router.post("/reply", authenticateToken, replyController.createReply);
router.get("/reply/:id", authenticateToken, replyController.getReplyByCommentId);
router.delete("/reply/:id", authenticateToken, replyController.deleteReply);

//*************************Manage issue Feedback*************************** */
router.get("/issueFeedback", authenticateToken, issuesfeedbackController.getAllIssuesFeedback);
router.get("/issueFeedback/:id", authenticateToken, issuesfeedbackController.getIssuesFeedback);

//****************************Subscribed Packages************************* */

router.get("/subscribePackage/:id", authenticateToken, subscribePackageController.getsubscribePackageById);
router.get("/active/subscribePackage/:id", authenticateToken, subscribePackageController.getActiveSubscribePackage);
router.get("/subscribePackageStudent/active/:id/:roleId", authenticateToken, subscribePackageController.getActiveStudentPackage);

router.post("/subscribePackage", authenticateToken, subscribePackageController.createSubscribePackage);
router.get("/verifyMaxUser", authenticateToken, subscribePackageController.verifyMaxUserCountClass);
router.get("/verifyMaxStudent", authenticateToken, subscribePackageController.verifyMaxStudentCount);

//*****************************Votes****************************** */

router.get("/vote/:id", authenticateToken, voteController.getVotes);
router.post("/vote", authenticateToken, voteController.addVote);

router.get("/receipe/assigned/:id", authenticateToken, lessonsController.getAssignedLessonByRecipeId)
router.get("/class/report/:id", authenticateToken, classReportController.classReportByStandard);
router.get("/schoolDashboard/practiceAndGrowth/:id", authenticateToken, schoolController.dashboardGraphData);
router.get("/districtDashboard/practiceAndGrowth/:id", authenticateToken, districtAdminController.dashboardGraphData);

//*****************************Mini Games****************************** */
router.get("/miniGame/imageDragDrop/", authenticateToken, miniGameController.imageDragDrop);
router.get("/miniGame/flagMatch/", authenticateToken, miniGameController.flagMatch);
router.get("/miniGame/imageFlip/", authenticateToken, miniGameController.imageFlip);

router.get("/studentAboveBelowAverage", authenticateToken, classReportController.studentAboveAndBelowAverageActivity);

//*****************************Notifications****************************** */
router.get("/notification/:entityId/:roleId", authenticateToken, notificationController.getNotifications);
router.get("/notificationCount/:entityId/:roleId", authenticateToken, notificationController.getNotificationCount);
router.put("/notification/seen/:entityId/:roleId", authenticateToken, notificationController.updateNotifications);

router.get("/showContactInformationToStudent", authenticateToken, studentController.showContactInformationToStudent);

module.exports = router;
