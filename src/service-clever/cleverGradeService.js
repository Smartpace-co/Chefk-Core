let Grade = require("../models/").grades;
const cleverUtils = require("../helpers/cleverUtils");

module.exports = {
  getGradeIdByCleverGrade: async (gradeTitle)=> {
    const grades = await Grade.findAll({});
    return cleverUtils.getGradeIdBasedCleverGrade(grades, gradeTitle);
  }
};
