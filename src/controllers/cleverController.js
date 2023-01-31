let utils = require("../helpers/utils");
const { StatusCodes } = require("http-status-codes");
const base64 = require("base-64");
const axios = require("axios");

require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];

const cleverHelper = require("../helpers/cleverHelper");
const cleverAuthService = require("../service-clever/cleverAuthService");
const cleverTeacherService = require("../service-clever/cleverTeacherService");
const paymentService = require("../service/paymentService");
const cleverStudentService = require("../service-clever/cleverStudentService");
const { CleverError } = require("../helpers/cleverHelper");
const { getKyesDiffrent } = require("../helpers/cleverUtils");
const cleverGradeService = require("../service-clever/cleverGradeService");
const cleverClassService = require("../service-clever/cleverClassService");

const { clientId, clientSecret, redirectUri } = config.clever;

const getCleverToken = async (code) => {
  const auth = `Basic ${base64.encode(`${clientId}:${clientSecret}`)}`;

  const tokenOptions = {
    url: "https://clever.com/oauth/tokens",
    headers: { Authorization: auth, "Content-type": "application/json" },
    data: {
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    },
    method: "POST",
  };

  try {
    const response = await axios(tokenOptions);
    const { data } = response;

    return { token: data.access_token };
  } catch (err) {
    throw new CleverError("Bad request", err.response.status);
  }
};

const getUserCleverByCode = async (code) => {
  try {
    const { token } = await getCleverToken(code);

    const cleverIdentity = await cleverHelper.getIdentity(token);

    const userResponse = await cleverHelper.getUserById(
      cleverIdentity.data.id,
      cleverIdentity.type,
      token
    );

    return { user: userResponse, token };
  } catch (error) {
    return { error: error };
  }
};

const getUserCleverByToken = async (token) => {
  try {
    const cleverIdentity = await cleverHelper.getIdentity(token);
    const userResponse = await cleverHelper.getUserById(
      cleverIdentity.data.id,
      cleverIdentity.type,
      token
    );

    return userResponse;
  } catch (error) {
    throw error;
  }
};

const syncUserTeacher = async (userId, currTeacher) => {

  const prevTeacher = await cleverTeacherService.getTeacher({ user_id: userId });
  const prevUser = await cleverAuthService.getUser({id: userId}); 

  const oldUser = {
    first_name: prevTeacher.first_name,
    last_name: prevTeacher.last_name,
    email: prevUser.email,
  }; 

  const newUser = {
    first_name: currTeacher.name.first,
    last_name: currTeacher.name.last,
    email: currTeacher.email, // email realted with user models
  };

  let changedData = getKyesDiffrent(oldUser, newUser);

  /**
   * Email affected on User Model, [email]
   * // other affected on Teacher Model
   */
  let isEmailChange = false;
  if (changedData.email) {
    await cleverAuthService.updateUser({ email: changedData.email }, { id: userId });
    isEmailChange = true;
    delete changedData["email"];
  }

  if (Object.keys(changedData).length > 0) {
    let fullN = newUser.first_name + " " + newUser.last_name;
    changedData = { ...changedData, contact_person_name: fullN };
    await cleverTeacherService.updateTeacher(changedData, { user_id: userId });
    if(isEmailChange){
      changedData["email"] = newUser.email
    }
  }

  return changedData;
};

const syncUserStudent = async (studentId, currStudent, userId = null) => {

  const prevStudent = await cleverStudentService.getStudent({ id: studentId});

  const oldStudent = {
    firstName: prevStudent.firstName,
    lastName: prevStudent.lastName,
    gradeId: prevStudent.gradeId,
    parentId: prevStudent.parentId,
  };

  const gradeTitle = currStudent.roles.student.grade;
  const gradeId = await cleverGradeService.getGradeIdByCleverGrade(gradeTitle);
  
  const newStudent = {
    firstName: currStudent.name.first,
    lastName: currStudent.name.last,
    gradeId,
    parentId: userId,
  };

  let changedData = getKyesDiffrent(oldStudent, newStudent);

  if (Object.keys(changedData).length > 0) {
    if(userId){
      changedData["updatedBy"] = userId;
    }

    await cleverStudentService.updateCleverStudent(changedData, {id: studentId});
  }

  return changedData;
};

const syncStudentsByTeacher = async (userId, cleverId, token) => {
  const allStudents = await cleverHelper.getMyStudents(cleverId, token);

  for (let std of allStudents.data) {
    // check is student stored or not
    const cleverStd = await cleverAuthService.getCleverUser({ id: std.data.id });

    if (!cleverStd) {
      await cleverAuthService.initUserStudent({ ...std.data, token }, null, userId); // NO need secret Here
    } else {
      const currStudent = std.data;
      await syncUserStudent(cleverStd["student_id"] , currStudent, userId);
    }
  }
};

const syncClassesByTeacher = async (sections, userId) => {
  const { id: teacherId } = await cleverTeacherService.getTeacher({ user_id: userId });

  for (let sec of sections) {
    // check is class exisit or Not
    const classData = await cleverClassService.getClassByCleverId(sec.data.id);

    if (!classData) {
      await cleverTeacherService.createClassByTeacher(sec.data, userId, teacherId);
    } else {
      // check it class need to update or not
      await cleverTeacherService.updateClassByTeacher(
        sec.data,
        userId,
        teacherId,
        classData
      );
    }
  }
};

module.exports = {
  oauthClever: async (req, res, next) => {
    try {
      const code = req.query.code;
      console.log("code: ", code);

      const { user, token, error } = await getUserCleverByCode(code);

      console.log("cleverToken: ", token);
      console.log("cleverUser 73: ", user);

      if (error) {
        let rediectSecret = "invalid-redirect";
        let queryMessage = "Something wrong with Redirect";
        let { status } = error;
        if (status === 429 || status === 500 || status === 502 || status === 503) {
          queryMessage = error.message;
        }
        const url = `${process.env.WEB_PORTAL_HOST}/auth/clever-redirect?clever-secret=${rediectSecret}&error=${queryMessage}`;
        return res.redirect(url);
      }

      let rediectSecret;
      if (user) {
        const { data } = user;
        const userRole = Object.keys(data.roles)[0];

        data["token"] = token;
        const cleverUser = await cleverAuthService.getCleverUser({ id: data.id });

        rediectSecret = await cleverHelper.getRediectSecret(userRole);
        if (cleverUser) {
          const updateData = { redirect_secret: rediectSecret, token };
          await cleverAuthService.updateCleverUser(updateData, { id: data.id });
        } else {
          if (userRole === "student") {
            await cleverAuthService.initUserStudent(data, rediectSecret);
          } else {
            await cleverAuthService.initUserTeacher(data, rediectSecret);
          }
        }
      } else {
        rediectSecret = "invalid-redirect";
      }

      const url = `${process.env.WEB_PORTAL_HOST}/auth/clever-redirect?clever-secret=${rediectSecret}`;
      console.log("url: ", url);
      res.redirect(url);
    } catch (err) {
      console.log(err);
      let rediectSecret = "internal-server-error";
      const url = `${process.env.WEB_PORTAL_HOST}/auth/clever-redirect?clever-secret=${rediectSecret}`;
      res.redirect(url);
    }
  },
  cleverTryLogin: async (req, res, next) => {
    try {
      const user = req.user;
      const response = await cleverAuthService.getUserInfo(user);

      if (response) {
        const { is_completed, data } = response;

        if (!is_completed) {
          return res.status(StatusCodes.OK).send(
            utils.responseGenerator(StatusCodes.OK, "Redirect clever successfully", {
              ...data,
              is_completed,
            })
          );
        }

        let loginResponse = {};
        const cleverRole = user.cleverRole;
        if (cleverRole === "student") {
          loginResponse = await cleverAuthService.cleverStudentLogin(response.data.id);
        } else {
          loginResponse = await cleverAuthService.cleverUserLogin(response.data.id);
        }

        loginResponse.data["is_completed"] = true;

        res.status(loginResponse.status).send(loginResponse);
      } else {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send(
            utils.responseGenerator(StatusCodes.UNAUTHORIZED, "clever user not exist")
          );
      }
    } catch (error) {
      console.log("handleCleverSecret: ", error);
      next(error);
    }
  },
  completeCreateTeacher: async (req, res, next) => {
    let userId = req.params.userId;

    try {
      userId = Number(userId);
      let responseUpdate = await cleverTeacherService.completeCreateTeacher(
        req.body,
        userId
      );

      // create Strip Session after succeffully (complete CreateTeacher Proccss)
      // this process handle in front-end with Normal user
      let stripeData = {
        subscribeId: responseUpdate.subscribeId,
        customerId: responseUpdate.customerId,
        priceId: responseUpdate.priceId,
      };

      /**
       * normalTeacher handle this in Client-side wheich make another request after register teacher success
       * - So, with clever User we don't need to handle it in clientSide
       */
      await paymentService.createSession(stripeData);

      // update CleverUser with is_completed: true;
      await cleverAuthService.updateCleverUser(
        {
          is_completed: true,
          redirect_secret: null,
        },
        { user_id: userId }
      );

      // try to

      const loginResponse = await cleverAuthService.cleverUserLogin(userId);

      loginResponse.data["is_completed"] = true;

      res.status(loginResponse.status).send(loginResponse);
    } catch (err) {
      next(err);
    }
  },
  completeCreateStudent: async (req, res, next) => {
    let studentId = req.params.studentId;

    try {
      studentId = Number(studentId);

      let responseUpdate = await cleverStudentService.completeCreateStudent(
        req.body,
        studentId
      );

      // create Strip Session after succeffully (complete CreateStudent Proccss)
      // this process handle in front-end with Normal Student
      let stripeData = {
        subscribeId: responseUpdate.subscribeId,
        customerId: responseUpdate.customerId,
        priceId: responseUpdate.priceId,
      };

      await paymentService.createSession(stripeData);

      // update CleverUser with is_completed: true;
      await cleverAuthService.updateCleverUser(
        {
          is_completed: true,
          redirect_secret: null,
        },
        { student_id: studentId }
      );

      const loginResponse = await cleverAuthService.cleverStudentLogin(studentId);

      loginResponse.data["is_completed"] = true;

      res.status(loginResponse.status).send(loginResponse);
    } catch (err) {
      next(err);
    }
  },
  syncUserWithClever: async (req, res, next) => {
    const { userId, type } = req.body;

    try {
      let changedData;
      let option = type === 'student' ? {student_id: userId} : {user_id: userId};

      const { token } = await cleverAuthService.getCleverUser(option);
      const currUser = await getUserCleverByToken(token);

      if (type === "student") {
        changedData = await syncUserStudent(userId, currUser.data);
      } else if (type === "teacher") {
        changedData = await syncUserTeacher(userId, currUser.data);
      } else {
        throw Error(`Not Support type of ${type} with clever`);
      }

      return res
        .status(StatusCodes.OK)
        .send(
          utils.responseGenerator(StatusCodes.OK, "Sync data Successfully", changedData)
        );
    } catch (error) {
      if (error instanceof CleverError) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send(
            utils.responseGenerator(
              StatusCodes.BAD_REQUEST,
              "Sync data Failed",
              {},
              true
            )
          );
      } else {
        throw error;
      }
    }
  },
  syncClassesByTeacher: async (req, res, next) => {
    const { userId, email } = req.body;

    if (!userId || !email) {
      throw new CleverError('Sync data is Failed', StatusCodes.BAD_REQUEST);
    }

    try {
      const { id: cleverId, token } = await cleverAuthService.getCleverUser({
        user_id: userId,
      });

      // update (subjects, students, classes) By only teacher (authorized_by: teacher)
      const sections = await cleverHelper.getSectionsByTeacher(cleverId, token);

      // 2) create subjects if not found
      await cleverTeacherService.createSubjectByTeacher(sections.data, userId);

      // 3) Update Teachers' students
      await syncStudentsByTeacher(userId, cleverId, token);

      // 4) Update classes
      await syncClassesByTeacher(sections.data, userId);

      return res
        .status(StatusCodes.OK)
        .send(
          utils.responseGenerator(StatusCodes.OK, "Sync data Successfully", {})
        );
    } catch (error) {
      if (error instanceof CleverError) {
        let message = 'Sync data is Failed'
        if(error.status === 404){
          message = 'Sorry: clever not share your classes with the app';
        }

        return res
          .status(StatusCodes.BAD_REQUEST)
          .send(
            utils.responseGenerator(
              StatusCodes.BAD_REQUEST,
              message,
              {},
              true
            )
          );
      } else {
        throw error;
      }
    }
  },
};
