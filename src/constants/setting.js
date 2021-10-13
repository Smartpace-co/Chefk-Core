//content settings
const contentSettings = [
  { key: "contentFullAccess", isEnable: false },
  { key: "contentGrades", content: [] },
  { key: "contentSubjects", content: [] },
  { key: "contentStandards", content: [] },
];

//profile settings
const profileSettings = [
  { key: "notiSchoolAnnouncements", isEnable: false },
  { key: "notiCourseAnnouncements", isEnable: false },
  { key: "notiStudentPerformanceAlerts", isEnable: false },
  { key: "notiNewCoursesAvailable", isEnable: false },
  { key: "notiLatestStudentSubmissionWork", isEnable: false },
  { key: "notiOpenEndedQuestionResponsesToBeGraded", isEnable: false },
  { key: "notiReceiveAllNotificationsAsEmails", isEnable: false },
  { key: "dataPrivacyShowContactInformationStudent", isEnable: false },
  { key: "dataPrivacyAllowStudentsToEmailMe", isEnable: false },
  { key: "dataPrivacyShowWorkingInformationToStudent", isEnable: false },
  { key: "languageSetYourPreferredLanguage", content: [0] },
];
// district settings
const districtSettings = [...profileSettings, ...contentSettings];
// district user settings
const districtUserSettings = [{ key: "languageSetYourPreferredLanguage", content: [0] }];
//school settings
const schoolSettings = [
  ...profileSettings,
  ...contentSettings,
  { key: "schoolShowPerformanceReportStudent", isEnable: false },
  { key: "schoolAllowLessonsExplorationsStudent", isEnable: false },
  { key: "schoolPassportStudent", isEnable: false },
];
// school user settings
const schoolUserSettings = [{ key: "languageSetYourPreferredLanguage", content: [0] }];
//teacher settings
const teacherSettings = [
  // { key: "notiSchoolAnnouncements", isEnable: false },
  // { key: "notiClassAnnouncements", isEnable: false },
  { key: "notiStudentPerformanceAlerts", isEnable: false },
  { key: "notiAssignmentSubmissions", isEnable: false },
  { key: "notiOpenEndedQuestionResponsesToBeGraded", isEnable: false },
  { key: "notiReceiveAllNotificationsAsEmails", isEnable: false },
  { key: "dataPrivacyShowContactInformationStudent", isEnable: false },
  { key: "dataPrivacyAllowStudentsToEmailMe", isEnable: false },
  // { key: "dataPrivacyShowWorkingInformationToStudent", isEnable: false },
  { key: "languageSetYourPreferredLanguage", content: [0] },
];
//class settings
const classSettings = [
  { key: "classShowPerformanceReportStudent", isEnable: false },
  { key: "classAllowLessonsExplorationsStudent", isEnable: false },
  { key: "classPassportStudent", isEnable: false },
  { key: "classBadgeStudent", isEnable: false },
  { key: "classMasteryPointStudent", isEnable: false },
  { key: "classShowLearnerProfileStudent", isEnable: false },
  { key: "classPointsLevelsStudent", isEnable: false },
  { key: "classHealthWellnessActivitiesStudent", isEnable: false },
  { key: "classMiniGamesStudent", isEnable: false },
];
//class settings
const studentSettings = [
  { key: "notiNewStudentAssignment", isEnable: false },
  { key: "notiCompleteStudentAssignment", isEnable: false },
  { key: "notiMembershipPaymentIsDue", isEnable: false },
  { key: "notiAppUpdateAvailable", isEnable: false },
  { key: "sendNotiToParent", isEnable: false },
  { key: "performanceReportReadyToParent", isEnable: false },
  { key: "completeStudentAssignmentToParent", isEnable: false },
  { key: "membershipPaymentIsDueToParent", isEnable: false },
  { key: "notiAppUpdateAvailableToParent", isEnable: false },
  { key: "shareAnalyticsDataAnonymouslyWithChefK", isEnable: false },
  { key: "languageSetYourPreferredLanguage", content: [0] },
];

//exporting joi schemas
module.exports = {
  districtSettings,
  districtUserSettings,
  schoolSettings,
  schoolUserSettings,
  teacherSettings,
  classSettings,
  studentSettings,
};
