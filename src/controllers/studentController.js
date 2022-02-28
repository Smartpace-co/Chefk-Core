"use strict";

let studentService = require("../service/studentService");
let { StatusCodes } = require("http-status-codes");

module.exports = {
  /**
   * @swagger
   * /api/v1/checkUserNameConflict:
   *   post:
   *     tags: ['Student']
   *     summary: Check user name conflict.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *     responses:
   *       200:
   *         description: No user name conflict.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string

   *       409:
   *         description: User name conflict.
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
   *                   type: strings
   *                 error :
   *                   type: string
   */
  checkUserNameConflict: async (req, res, next) => {
    try {
      const { name } = req.body;
      let response = await studentService.checkUserNameConflict(name);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student:
   *   post:
   *     tags: ['Student']
   *     summary: Register student.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               contactPersonEmail:
   *                 type: string
   *               contactPersonNumber:
   *                 type: string
   *               userName:
   *                 type: string
   *               districtId:
   *                 type: number
   *               customDistrictName:
   *                 type: string
   *               schoolId:
   *                 type: number
   *               customSchoolName:
   *                 type: string
   *               classIds:
   *                 type: array
   *                 items:
   *                   type: number
   *               gradeId:
   *                 type: number
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               dob:
   *                 type: string
   *               profileImage:
   *                 type: string
   *               address:
   *                 type: string
   *               gender:
   *                 type: string
   *               ethnicityId:
   *                 type: number
   *               allergenIds:
   *                 type: array
   *                 items:
   *                   type: number
   *               medicalConditionIds:
   *                 type: array
   *                 items:
   *                   type: number
   *               contactPersonName:
   *                 type: string
   *               contactPersonRelationId:
   *                 type: number
   *               status:
   *                 type: boolean
   *               parentId:
   *                 type: number
   *               packageId:
   *                 type: number
   *               roleId:
   *                 type: number
   *     responses:
   *       200:
   *         description: Email send successfull.
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
   *                 error :
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
  createStudent: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const { id } = req.user;
      let response = await studentService.createStudent(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student/file:
   *   post:
   *     tags: ['Student']
   *     summary: Create student from file.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               districtId:
   *                 type: string
   *               schoolId:
   *                 type: string
   *               file_name:
   *                 type: string
   *               parentId:
   *                 type: number
   *     responses:
   *       200:
   *         description: Result.
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
   *                    success:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           status:
   *                            type: string
   *                           row:
   *                            type: object
   *                            properties:
   *                               userName:
   *                                 type: string
   *                               first_name:
   *                                 type: string
   *                               last_name:
   *                                 type: string
   *                               dob:
   *                                 type: string
   *                               grade:
   *                                 type: string
   *                               contact_type:
   *                                 type: string
   *                               email:
   *                                 type: string
   *                               phone_number:
   *                                 type: number
   *                               contact_name:
   *                                 type: string
   *                               contact_relation:
   *                                 type: string
   *                               school:
   *                                 type: string
   *                               gender:
   *                                 type: string
   *                               status:
   *                                 type: boolean
   *                    failed:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           error:
   *                             type: string
   *                           row:
   *                             type: object
   *                             properties:
   *                               userName:
   *                                 type: string
   *                               first_name:
   *                                 type: string
   *                               last_name:
   *                                 type: string
   *                               dob:
   *                                 type: string
   *                               grade:
   *                                 type: string
   *                               contact_type:
   *                                 type: string
   *                               email:
   *                                 type: string
   *                               phone_number:
   *                                 type: number
   *                               contact_name:
   *                                 type: string
   *                               contact_relation:
   *                                 type: string
   *                               school:
   *                                 type: string
   *                               gender:
   *                                 type: string
   *                               status:
   *                                 type: boolean
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
   *       400:
   *         description: District/School do not exist.
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
  createStudentFromFile: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const { id } = req.user;
      let response = await studentService.createStudentFromFile(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student:
   *   get:
   *     tags: ['Student']
   *     summary: Get student.
   *     responses:
   *       200:
   *         description: Students fetched.
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
   *                  type: object
   *                  properties:
   *                     count:
   *                       type: number
   *                     rows:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: number
   *                           districtId:
   *                             type: number
   *                           customDistrictName:
   *                             type: string
   *                             format: nullable
   *                           schoolId:
   *                             type: number
   *                           customSchoolName:
   *                             type: string
   *                             format: nullable
   *                           firstName:
   *                             type: string
   *                           lastName:
   *                             type: string
   *                           dob:
   *                             type: string
   *                           profileImage:
   *                             type: string
   *                             format: nullable
   *                           gender:
   *                             type: string
   *                           contactPersonEmail:
   *                             type: string
   *                           contactPersonNumber:
   *                             type: string
   *                           contactPersonName:
   *                             type: string
   *                           contactPersonGender:
   *                             type: string
   *                             format: nullable
   *                           emergencyContactNumber:
   *                             type: string
   *                             format: nullable
   *                           date:
   *                             type: string
   *                             format: nullable
   *                           isSubscriptionPause:
   *                             type: boolean
   *                           status:
   *                             type: boolean
   *                           isEmailVerified:
   *                             type: boolean
   *                           isPhoneVerified:
   *                             type: boolean
   *                           customerId:
   *                             type: string
   *                           parentId:
   *                             type: number
   *                           createdBy:
   *                             type: number
   *                           updatedBy:
   *                             type: number
   *                           createdAt:
   *                             type: string
   *                           updatedAt:
   *                             type: string
   *                           school_id:
   *                             type: number
   *                           grade:
   *                             type: object
   *                             properties:
   *                               id:
   *                                 type: number
   *                               grade:
   *                                 type: string
   *                               created_by:
   *                                 type: number
   *                               updated_by:
   *                                 type: string
   *                                 format: nullable
   *                               createdAt:
   *                                 type: string
   *                               updatedAt:
   *                                 type: string
   *                           ethnicity:
   *                             type: object
   *                             properties:
   *                               id:
   *                                 type: number
   *                               title:
   *                                 type: string
   *                               description:
   *                                 type: string
   *                                 format: nullable
   *                               createdBy:
   *                                 type: number
   *                               updatedBy:
   *                                 type: string
   *                                 format: nullable
   *                               createdAt:
   *                                 type: string
   *                               updatedAt:
   *                                 type: string
   *                           relation:
   *                             type: object
   *                             properties:
   *                               id:
   *                                 type: number
   *                               title:
   *                                 type: string
   *                               description:
   *                                 type: string
   *                                 format: nullable
   *                               type:
   *                                 type: string
   *                               createdBy:
   *                                 type: number
   *                               updatedBy:
   *                                 type: string
   *                                 format: nullable
   *                               createdAt:
   *                                 type: string
   *                               updatedAt:
   *                                 type: string
   *                           allergens:
   *                             type: array
   *                             items:
   *                               type: object
   *                               properties:
   *                                 id:
   *                                   type: number
   *                                 allergen:
   *                                   type: object
   *                                   properties:
   *                                     id:
   *                                       type: number
   *                                     allergenTitle:
   *                                       type: string
   *                                     status:
   *                                       type: boolean
   *                                     createdBy:
   *                                       type: number
   *                                     updatedBy:
   *                                       type: string
   *                                       format: nullable
   *                                     createdAt:
   *                                       type: string
   *                                     updatedAt:
   *                                       type: string
   *       401:
   *         description: Invalid token / Unathorized Access.
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
  getAllStudents: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await studentService.getAllStudents(req, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student:
   *   get:
   *     tags: ['Student']
   *     summary: Get student.
   *     parameters:
   *     - in: param
   *       name: id
   *       schema:
   *        type: number
   *     responses:
   *       200:
   *         description: Student fetched successfully.
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
   *                  type: object
   *                  properties:
   *                           id:
   *                             type: number
   *                           districtId:
   *                             type: number
   *                           customDistrictName:
   *                             type: string
   *                             format: nullable
   *                           schoolId:
   *                             type: number
   *                           customSchoolName:
   *                             type: string
   *                             format: nullable
   *                           firstName:
   *                             type: string
   *                           lastName:
   *                             type: string
   *                           dob:
   *                             type: string
   *                           profileImage:
   *                             type: string
   *                             format: nullable
   *                           gender:
   *                             type: string
   *                           contactPersonEmail:
   *                             type: string
   *                           contactPersonNumber:
   *                             type: string
   *                           contactPersonName:
   *                             type: string
   *                           contactPersonGender:
   *                             type: string
   *                             format: nullable
   *                           emergencyContactNumber:
   *                             type: string
   *                             format: nullable
   *                           date:
   *                             type: string
   *                             format: nullable
   *                           isSubscriptionPause:
   *                             type: boolean
   *                           status:
   *                             type: boolean
   *                           isEmailVerified:
   *                             type: boolean
   *                           isPhoneVerified:
   *                             type: boolean
   *                           customerId:
   *                             type: string
   *                           parentId:
   *                             type: number
   *                           createdBy:
   *                             type: number
   *                           updatedBy:
   *                             type: number
   *                           createdAt:
   *                             type: string
   *                           updatedAt:
   *                             type: string
   *                           school_id:
   *                             type: number
   *                           grade:
   *                             type: object
   *                             properties:
   *                           school:
   *                             type: object
   *                             properties:
   *                           ethnicity:
   *                             type: object
   *                             properties:
   *                           relation:
   *                             type: object
   *                             properties:
   *                           classes:
   *                             type: array
   *                             items:
   *                               type: object
   *                               properties:
   *                                 id:
   *                                  type: number
   *                                 title:
   *                                  type: string
   *                                 description:
   *                                  type: string
   *                           allergens:
   *                             type: array
   *                             items:
   *                               type: object
   *                               properties:
   *                                 id:
   *                                   type: number
   *                                 allergen:
   *                                   type: object
   *                                   properties:
   *                           medicalConditions:
   *                             type: array
   *                             items:
   *                               type: object
   *                               properties:
   *                                 id:
   *                                  type: number
   *                                 title:
   *                                  type: string
   *                                 description:
   *                                  type: string
   *       400:
   *         description: Student does not exist
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
  getStudent: async (req, res, next) => {
    try {
      const { id, isStudent } = req.user;
      const param_id = req.params.id;
      let response = await studentService.getStudent(param_id, id, isStudent);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student:
   *   put:
   *     tags: ['Student']
   *     summary: Update student.
   *     parameters:
   *     - in: param
   *       name: id
   *       schema:
   *        type: number
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               contactPersonEmail:
   *                 type: string
   *               contactPersonNumber:
   *                 type: string
   *               userName:
   *                 type: string
   *               districtId:
   *                 type: number
   *               customDistrictName:
   *                 type: string
   *               schoolId:
   *                 type: number
   *               customSchoolName:
   *                 type: string
   *               classIds:
   *                 type: array
   *                 items:
   *                   type: number
   *               gradeId:
   *                 type: number
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               dob:
   *                 type: string
   *               profileImage:
   *                 type: string
   *               address:
   *                 type: string
   *               gender:
   *                 type: string
   *               ethnicityId:
   *                 type: number
   *               allergenIds:
   *                 type: array
   *                 items:
   *                   type: number
   *               medicalConditionIds:
   *                 type: array
   *                 items:
   *                   type: number
   *               contactPersonName:
   *                 type: string
   *               contactPersonRelationId:
   *                 type: number
   *               status:
   *                 type: boolean
   *               parentId:
   *                 type: number
   *     responses:
   *       200:
   *         description: Student details updated successfully.
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
   *                  type: array
   *                  items:
   *                    type: number
   *       400:
   *         description: Student does not exist
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
  updateStudent: async (req, res, next) => {
    try {
      const { id, isStudent } = req.user;
      const param_id = req.params.id;
      const reqBody = req.body;
      let response = await studentService.updateStudent(reqBody, param_id, id, isStudent);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student/class:
   *   get:
   *     tags: ['Student']
   *     parameters:
   *     - in: param
   *       name: id
   *       schema:
   *        type: number
   *     summary: Get student by class id.
   *     responses:
   *       200:
   *         description: Students fetched.
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
   *                  type: object
   *                  properties:
   *                     count:
   *                       type: number
   *                     rows:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: number
   *                           districtId:
   *                             type: number
   *                           customDistrictName:
   *                             type: string
   *                             format: nullable
   *                           schoolId:
   *                             type: number
   *                           customSchoolName:
   *                             type: string
   *                             format: nullable
   *                           firstName:
   *                             type: string
   *                           lastName:
   *                             type: string
   *                           dob:
   *                             type: string
   *                           profileImage:
   *                             type: string
   *                             format: nullable
   *                           gender:
   *                             type: string
   *                           contactPersonEmail:
   *                             type: string
   *                           contactPersonNumber:
   *                             type: string
   *                           contactPersonName:
   *                             type: string
   *                           contactPersonGender:
   *                             type: string
   *                             format: nullable
   *                           emergencyContactNumber:
   *                             type: string
   *                             format: nullable
   *                           date:
   *                             type: string
   *                             format: nullable
   *                           isSubscriptionPause:
   *                             type: boolean
   *                           status:
   *                             type: boolean
   *                           isEmailVerified:
   *                             type: boolean
   *                           isPhoneVerified:
   *                             type: boolean
   *                           customerId:
   *                             type: string
   *                           parentId:
   *                             type: number
   *                           createdBy:
   *                             type: number
   *                           updatedBy:
   *                             type: number
   *                           createdAt:
   *                             type: string
   *                           updatedAt:
   *                             type: string
   *                           school_id:
   *                             type: number
   *                           grade:
   *                             type: object
   *                             properties:
   *                               id:
   *                                 type: number
   *                               grade:
   *                                 type: string
   *                               created_by:
   *                                 type: number
   *                               updated_by:
   *                                 type: string
   *                                 format: nullable
   *                               createdAt:
   *                                 type: string
   *                               updatedAt:
   *                                 type: string
   *                           ethnicity:
   *                             type: object
   *                             properties:
   *                               id:
   *                                 type: number
   *                               title:
   *                                 type: string
   *                               description:
   *                                 type: string
   *                                 format: nullable
   *                               createdBy:
   *                                 type: number
   *                               updatedBy:
   *                                 type: string
   *                                 format: nullable
   *                               createdAt:
   *                                 type: string
   *                               updatedAt:
   *                                 type: string
   *                           relation:
   *                             type: object
   *                             properties:
   *                               id:
   *                                 type: number
   *                               title:
   *                                 type: string
   *                               description:
   *                                 type: string
   *                                 format: nullable
   *                               type:
   *                                 type: string
   *                               createdBy:
   *                                 type: number
   *                               updatedBy:
   *                                 type: string
   *                                 format: nullable
   *                               createdAt:
   *                                 type: string
   *                               updatedAt:
   *                                 type: string
   *                           allergens:
   *                             type: array
   *                             items:
   *                               type: object
   *                               properties:
   *                                 id:
   *                                   type: number
   *                                 allergen:
   *                                   type: object
   *                                   properties:
   *                                     id:
   *                                       type: number
   *                                     allergenTitle:
   *                                       type: string
   *                                     status:
   *                                       type: boolean
   *                                     createdBy:
   *                                       type: number
   *                                     updatedBy:
   *                                       type: string
   *                                       format: nullable
   *                                     createdAt:
   *                                       type: string
   *                                     updatedAt:
   *                                       type: string
   *       401:
   *         description: Invalid token
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
  getStudentsByclassId: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      let response = await studentService.getStudentsByClassId(req, param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  getStudentCount: async (req, res, next) => {
    try {
      let id = req.query.id;
      let roleId = req.query.roleId;
      let packageId = req.query.packageId;
      let response = await studentService.getStudentCount(id, roleId, packageId);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  showContactInformationToStudent: async (req, res, next) => {
    try {
      let id = req.user.id;
      console.log(id);
      let response = await studentService.showContactInformationToStudent(id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
};
