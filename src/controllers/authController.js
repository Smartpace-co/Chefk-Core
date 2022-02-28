let authService = require("../service/authService");

module.exports = {
  /**
   * @swagger
   * /api/v1/guestToken:
   *   get:
   *     tags: ['Auth']
   *     summary: Generate Guest token.
   *     security: []
   *     responses:
   *       200:
   *         description: Guest token generated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                       guestToken:
   *                         type: string
   *       500:
   *         description: Internal server error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *                 error :
   *                   type: string
   */
  getGuestToken: async (req, res, next) => {
    try {
      let response = await authService.getGuestToken();
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/login:
   *   post:
   *     tags: ['Auth']
   *     summary: Login authentication.
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successfull.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: number
   *                     customerId:
   *                       type: string
   *                     parentId:
   *                       type: number
   *                     role_id:
   *                       type: number
   *                     parent_role_id:
   *                       type: number
   *                     email:
   *                       type: string
   *                     phone_number:
   *                       type: string
   *                     isAdmin:
   *                       type: boolean
   *                     isSubscriptionPause:
   *                       type: boolean
   *                     status:
   *                       type: boolean
   *                     profile_image:
   *                       type: string
   *                       format: nullable
   *                     is_email_verified:
   *                       type: boolean
   *                     is_phone_verified:
   *                       type: boolean
   *                     role:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: number
   *                         title:
   *                           type: string
   *                         description:
   *                           type: string
   *                         isMaster:
   *                           type: boolean
   *                         status:
   *                           type: boolean
   *                         createdBy:
   *                           type: number
   *                         updatedBy:
   *                           type: number
   *                         createdAt:
   *                           type: string
   *                         updatedAt:
   *                           type: string
   *                     token:
   *                       type: string
   *                     isPaymentRemaining:
   *                       type: boolean
   *                     language:
   *                       type: object
   *                       properties:
   *                     subscribeId:
   *                       type: number
   *                     priceId:
   *                       type: string
   *                     parent_role:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: number
   *                         title:
   *                           type: string
   *                         description:
   *                           type: string
   *                         isMaster:
   *                           type: boolean
   *                         status:
   *                           type: boolean
   *                         createdBy:
   *                           type: number
   *                         updatedBy:
   *                           type: number
   *                         createdAt:
   *                           type: string
   *                         updatedAt:
   *                           type: string
   *                     is_subscription_pause:
   *                       type: boolean
   *       401:
   *         description: email or password is incorrect.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       403:
   *         description: User inactive.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       500:
   *         description: Internal server error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *                 error :
   *                   type: string
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      let response = await authService.login(email, password);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/studentLogin:
   *   post:
   *     tags: ['Auth']
   *     summary: Student login authentication.
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userName:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successfull.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: number
   *                     userName:
   *                       type: string
   *                     districtId:
   *                       type: number
   *                     schoolId:
   *                       type: number
   *                     gradeId:
   *                       type: number
   *                     firstName:
   *                       type: string
   *                     lastName:
   *                       type: string
   *                     dob:
   *                       type: string
   *                     profileImage:
   *                       type: string
   *                       format: nullable
   *                     gender:
   *                       type: string
   *                     ethnicityId:
   *                       type: number
   *                     contactPersonEmail:
   *                       type: string
   *                     contactPersonNumber:
   *                       type: string
   *                     contactPersonName:
   *                       type: string
   *                     contactPersonRelationId:
   *                       type: number
   *                     contactPersonGender:
   *                       type: string
   *                       format: nullable
   *                     emergencyContactNumber:
   *                       type: number
   *                     date:
   *                       type: string
   *                       format: nullable
   *                     isSubscriptionPause:
   *                       type: boolean
   *                     status:
   *                       type: boolean
   *                     isEmailVerified:
   *                       type: boolean
   *                     isPhoneVerified:
   *                       type: boolean
   *                     customerId:
   *                       type: string
   *                     parentId:
   *                       type: number
   *                     createdBy:
   *                       type: number
   *                     updatedBy:
   *                       type: number
   *                     createdAt:
   *                       type: string
   *                     updatedAt:
   *                       type: string
   *                     ethnicity_id:
   *                       type: number
   *                     grade_id:
   *                       type: number
   *                     contact_person_relation_id:
   *                       type: number
   *                     school_id:
   *                       type: number
   *                     role:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: number
   *                         title:
   *                           type: string
   *                         description:
   *                           type: string
   *                         isMaster:
   *                           type: boolean
   *                         status:
   *                           type: boolean
   *                         createdBy:
   *                           type: number
   *                         updatedBy:
   *                           type: number
   *                         createdAt:
   *                           type: string
   *                         updatedAt:
   *                           type: string
   *                     language:
   *                       type: object
   *                       properties:
   *                     token:
   *                       type: string
   *                     isPaymentRemaining:
   *                       type: boolean
   *                     subscribeId:
   *                       type: number
   *                     priceId:
   *                       type: string
   *                     is_subscription_pause:
   *                       type: boolean
   *       401:
   *         description: Username or password is incorrect.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       403:
   *         description: User inactive.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       500:
   *         description: Internal server error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *                 error :
   *                   type: string
   */
  studentLogin: async (req, res, next) => {
    try {
      const { userName, password } = req.body;
      let response = await authService.studentLogin(userName, password);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/forgotPassword/validateEmail:
   *   post:
   *     tags: ['Auth']
   *     summary: Forgot password validate email.
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *     responses:
   *       200:
   *         description: Email verification send successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                       id:
   *                         type: number
   *                       role_id:
   *                         type: number
   *                       phone_number:
   *                         type: number
   *                       email:
   *                         type: string
   *                       status:
   *                         type: boolean
   *       404:
   *         description: Email is not registred.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       500:
   *         description: Internal server error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *                 error :
   *                   type: string
   */
  forgotPasswordValidateEmail: async (req, res, next) => {
    try {
      const { email } = req.body;
      let response = await authService.forgotPasswordValidateEmail(email);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/studentForgotPassword/validateEmail:
   *   post:
   *     tags: ['Auth']
   *     summary: Forgot password validate email.
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userName:
   *                 type: string
   *     responses:
   *       200:
   *         description: Student verification send successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       404:
   *         description: Student is not registred.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       500:
   *         description: Internal server error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *                 error :
   *                   type: string
   */
  studentForgotPasswordValidateEmail: async (req, res, next) => {
    try {
      const { userName } = req.body;
      let response = await authService.studentForgotPasswordValidateEmail(userName);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/resetPassword/{token}:
   *   put:
   *     tags: ['Auth']
   *     summary: Reset password.s
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               password:
   *                type: string
   *     responses:
   *       200:
   *         description: Password reset successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       401:
   *         description: Invalid token.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       404:
   *         description: User not registered.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       500:
   *         description: Internal server error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *                 error :
   *                   type: string
   */
  resetPassword: async (req, res, next) => {
    try {
      const { password } = req.body;
      const { token } = req.params;
      let response = await authService.resetPassword(token, password);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/userByToken:
   *   get:
   *     tags: ['Auth']
   *     summary: Get user details from token.
   *     responses:
   *       200:
   *         description: User details fetched successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: number
   *                     role_id:
   *                       type: number
   *                     parent_role_id:
   *                       type: number
   *                     email:
   *                       type: string
   *                     phone_number:
   *                       type: string
   *                     isAdmin:
   *                       type: boolean
   *                     isSubscriptionPause:
   *                       type: boolean
   *                     status:
   *                       type: boolean
   *                     profile_image:
   *                       type: string
   *                       format: nullable
   *                     is_email_verified:
   *                       type: boolean
   *                     is_phone_verified:
   *                       type: boolean
   *                     createdBy:
   *                       type: number
   *                     updatedBy:
   *                       type: number
   *                     createdAt:
   *                       type: string
   *                     updatedAt:
   *                       type: string
   *       401:
   *         description: Invalid token.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       404:
   *         description: User not found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       500:
   *         description: Internal server error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *                 error :
   *                   type: string
   */
  getUserByToken: async (req, res, next) => {
    try {
      const { isStudent } = req.user;
      const { token } = req.headers;
      let response = await authService.getUserByToken(isStudent, token);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/changepassword:
   *   put:
   *     tags: ['Auth']
   *     summary: Change user password.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               currentPassword:
   *                type: string
   *               newPassword:
   *                type: string
   *     responses:
   *       200:
   *         description: Password updated.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       401:
   *         description: Invalid token.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       403:
   *         description: Password incorrect.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       404:
   *         description: User not found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       500:
   *         description: Internal server error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *                 error :
   *                   type: string
   */
  changePassword: async (req, res, next) => {
    try {
      const { id, isStudent } = req.user;
      const { currentPassword, newPassword } = req.body;
      let response = await authService.changePassword(id, isStudent, currentPassword, newPassword);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/logout:
   *   post:
   *     tags: ['Auth']
   *     summary: Logout user.
   *     responses:
   *       200:
   *         description: Logout successful.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       401:
   *         description: Invalid token.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       500:
   *         description: Internal server error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *                 error :
   *                   type: string
   */
  logout: async (req, res, next) => {
    try {
      const { token } = req.headers;
      let response = await authService.logout(token);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  topActiveSessionTeachers: async (req, res, next) => {
    try {
      let response = await authService.topActiveSessionTeachers(req);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  topActiveSessionStudents: async (req, res, next) => {
    try {
      let response = await authService.topActiveSessionStudents(req);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
};
