let User = require("../models").users;
let DistrictAdmin = require("../models").district_admins;
let School = require("../models").schools;
let Teacher = require("../models").teachers;
let CleverUser = require("../models/").clever_users;
let CleverClassMap = require("../models/").clever_class_map;
let Subject = require("../models").subjects;
let Class = require("../models").classes;
let Class_standard_subject_group = require("../models").class_standard_subject_groups;
let Class_teacher = require("../models").class_teachers;
let Class_student = require("../models").class_students;
let SubscribePackage = require("../models").subscribe_packages;
let Grade = require("../models/").grades;
let { sequelize } = require("../models/index");
let { teacherSettings } = require("../constants/setting");
const fs = require("fs");
let JWTHelper = require("../helpers/jwtHelper");
let utils = require("../helpers/utils");
let stripeHelper = require("../helpers/stripeHelper");
let modelHelper = require("../helpers/modelHelper");
let { StatusCodes } = require("http-status-codes");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
let { UniqueConstraintError, ForeignKeyConstraintError } = require("sequelize");
const cleverUtils = require("../helpers/cleverUtils");

const { createSubscribePackage } = require("../service/subscribePackageService");
const classService = require("../service/classService");

//////////////////////////////// FUNCTIONS
async function createSubPackage(reqBody, userId, t) {
  try {
    const { parent_id } = reqBody;
    let subscribePackageDetails = {};
    if (!parent_id) {
      subscribePackageDetails = await SubscribePackage.create(
        {
          uuid: await utils.getUUID("SP"),
          entityId: userId,
          roleId: reqBody.role_id,
          packageId: reqBody.package_id,
          // isOwner: true,
        },
        { transaction: t }
      );
      await Teacher.update(
        {
          subscribeId: subscribePackageDetails.id,
        },
        {
          where: { user_id: userId },
          transaction: t,
        }
      );
    } else {
      subscribePackageDetails = await SubscribePackage.findOne({
        where: { entityId: parent_id },
      });
    }

    return subscribePackageDetails;
  } catch (err) {
    throw err;
  }
}

async function updateTr(reqBody, userId, t) {
  try {
    const { parent_id } = reqBody;

    let accessToken = JWTHelper.getAccessTokenCleverUser(userId);

    const customer = await stripeHelper.createCustomer(
      reqBody.email,
      reqBody.first_name
    );

    await User.update(
      {
        ...reqBody,
        token: accessToken,
        status: true,
      },
      {
        where: {
          id: userId,
        },
        transaction: t,
      }
    );

    await Teacher.update(
      {
        ...reqBody,
        parentId: parent_id,
        customerId: customer.id,
      },
      {
        where: {
          user_id: userId,
        },
        transaction: t,
      }
    );

    return customer.id;
  } catch (err) {
    throw err;
  }
}

async function getGradeId(gradeName) {
  try {
    const grades = await Grade.findAll({});
    return cleverUtils.getGradeIdBasedCleverGrade(grades, gradeName);
  } catch (err) {
    console.log("Error: gradeId: ", err);
    return null; // suppose gradeId default value null
  }
}

async function getSubjectId(title) {
  let res = [];

  const subjects = await Subject.findAll({});
  for (let i = 0; i < subjects.length; i++) {
    if (subjects[i].subjectTitle === title) {
      res.push(subjects[i].id);
      break;
    }
  }
  return res;
}

async function getStudentByCleverId(cleverIds) {
  const cleverUsers = await CleverUser.findAll({
    where: {
      id: {
        [Op.or]: cleverIds,
      },
    },
  });

  let res = cleverUsers.reduce((acc, curr) => {
    return [...acc, curr.student_id];
  }, []);

  return res;
}

async function handleAndGetNewData(section, teacherId) {
  let gradeId = await getGradeId(section.grade);
  let subjIds = await getSubjectId(section.subject);
  let studentIds = await getStudentByCleverId(section.students);

  return {
    title: section.name,
    grade_id: gradeId,
    assigned_teacher_ids: [teacherId],
    assigned_standard_subject_group_ids: subjIds,
    assigned_student_ids: studentIds,
  };
}

async function handleAndGetOldData(teacherId, oldClass) {
  const stdSaved = await Class_student.findAll({
    where: {
      class_id: oldClass.id,
    },
  });

  const subjSaved = await Class_standard_subject_group.findAll({
    where: {
      class_id: oldClass.id,
    },
  });

  const teacherClassSaved = await Class_teacher.findOne({
    where: {
      teacher_id: teacherId,
      class_id: oldClass.id
    },
  });

  const oldStdIds = stdSaved.map((el) => el.get("student_id"));
  const oldSubjIds = subjSaved.map((el) => el.get("subject_id"));
  const oldTeacherIds = !teacherClassSaved ? [] : [teacherId];

  return {
    title: oldClass.title,
    grade_id: oldClass.grade_id,
    assigned_teacher_ids: oldTeacherIds, // need to handle
    assigned_standard_subject_group_ids: oldSubjIds, // need to handle
    assigned_student_ids: oldStdIds, // need to handle
  };
}

function filterDataChanged(oldData, newData) {
  let updatedData = {};

  /**
   * NOTE:
   * - title and grade not need to compare: because if change will be new Class
   *  */
  if (oldData.title !== newData.title) {
    updatedData.title = newData.title;
  }
  if (oldData.grade_id !== newData.grade_id) {
    updatedData.grade_id = newData.grade_id;
  }

  if (oldData.assigned_teacher_ids[0] !== newData.assigned_teacher_ids[0]) {
    updatedData.assigned_teacher_ids = [newData.assigned_teacher_ids[0]];
  }

  let newSubjIds = newData.assigned_standard_subject_group_ids.filter((el) => {
    return oldData.assigned_standard_subject_group_ids.indexOf(el) === -1;
  });

  let newStudentIds = newData.assigned_student_ids.filter((el) => {
    return oldData.assigned_student_ids.indexOf(el) === -1;
  });

  // With any changes with Data update class with newData
  if (newSubjIds.length > 0) {
    updatedData.assigned_standard_subject_group_ids =
      newData.assigned_standard_subject_group_ids;
  }
  if (newStudentIds.length > 0) {
    updatedData.assigned_student_ids = newData.assigned_student_ids;
  }

  return updatedData;
}

function extractCodeFromTitle(title) {
  let index = title.length - 1;
  for (let i = title.length - 1; i >= 0; i--) {
    if (title[i] === "#") {
      index = i;
      break;
    }
  }

  return {
    title: title.slice(0, index),
    code: title.slice(index),
  };
}

module.exports = {
  completeCreateTeacher: async (reqBody, userId) => {
    const t = await sequelize.transaction();

    try {
      const { district_id, school_id, role_id, priceId } = reqBody;

      if (district_id) {
        const count = await DistrictAdmin.count({ where: { id: district_id } });
        if (!count) {
          return utils.responseGenerator(
            StatusCodes.BAD_REQUEST,
            "District does not exist"
          );
        }
      }
      if (school_id) {
        const count = await School.count({ where: { id: school_id } });
        if (!count) {
          return utils.responseGenerator(
            StatusCodes.BAD_REQUEST,
            "School does not exist"
          );
        }
      }

      // update user and teacher
      const customerId = await updateTr(reqBody, userId, t);

      const savedSubPackages = await createSubPackage(reqBody, userId, t);

      const savedTeacher = await Teacher.findOne({
        where: { user_id: userId },
      });

      await modelHelper.addSettings(savedTeacher.id, role_id, teacherSettings, t);

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
  createSubjectByTeacher: async (sections, userId) => {
    const subjects = cleverUtils.filterSubjects(sections);
    try {
      for (let name of subjects) {
        let obj = {
          subjectTitle: name,
          status: true,
          systemLanguageId: "1",
          createdBy: userId,
        };
        await Subject.create(obj);
      }

      return 1;
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        return 0;
      }
      console.log("Error ==> ", err);
      throw err;
    }
  },
  createClassByTeacher: async (section, userId, teacherId) => {
    const count = await Class.count({
      where: { title: section.name, deleted_at: null },
    });
    if (count) return; // skip

    const gradeId = await getGradeId(section.grade);
    const subjIds = await getSubjectId(section.subject);
    const studentIds = await getStudentByCleverId(section.students);

    let obj = {
      title: section.name + "#" + utils.randomString(8), // to prevent duplicate classes
      grade_id: gradeId,
      assigned_teacher_ids: [teacherId],
      assigned_standard_subject_group_ids: subjIds,
      assigned_standard_ids: [],
      assigned_student_ids: studentIds,
      status: true,
      parent_id: userId,
    };

    const classSaved = await classService.createClass(obj, userId);

    await CleverClassMap.create({
      clever_id: section.id,
      class_id: classSaved.data.id,
    });
  },
  updateClassByTeacher: async (section, userId, teacherId, oldClass) => {
    const { title, code } = extractCodeFromTitle(oldClass.title);
    oldClass.title = title;

    const oldData = await handleAndGetOldData(teacherId, oldClass);

    const newData = await handleAndGetNewData(section, teacherId);

    let dataChanged = filterDataChanged(oldData, newData);

    // if title changed update it to prevent duplicate names from clever
    if (dataChanged.title) {
      dataChanged.title = newData.title + code;
    }

    let dropClassStudent = oldData.assigned_student_ids.filter(
      (el) => newData.assigned_student_ids.indexOf(el) === -1
    );

    /**
     * whene other teacher create this class
     * - we need to assign teacher into this class_teacher
     */

    if (dataChanged["assigned_teacher_ids"]) {
      await Class_teacher.create({
        class_id: oldClass.id,
        teacher_id: teacherId,
        createdBy: userId,
      });
    }

    // update classeChange
    if (
      Object.keys(dataChanged).length > 0 &&
      dataChanged["assigned_teacher_ids"].length === 0
    ) {
      await classService.updateClass(dataChanged, oldClass.id, userId);
    }

    // Clear prev
    if (dropClassStudent.length > 0) {
      for (let stdId of dropClassStudent) {
        await Class_student.destroy({
          where: { class_id: oldClass.id, student_id: stdId },
        });
      }
    }
  },
  getTeacher: async (option) => {
    try {
      const teacher = await Teacher.findOne({
        where: { ...option },
      });
      return teacher.dataValues;
    } catch (error) {
      throw error;
    }
  },
  updateTeacher: async (data, option) => {
    try {
      await Teacher.update(data, {
        where: { ...option },
      });
    } catch (error) {
      throw error;
    }
  },
};
