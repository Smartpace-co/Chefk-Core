"use strict";

let teacherService = require("../service/teacherService");
let { StatusCodes } = require("http-status-codes");

module.exports = {
  /**
   * @swagger
   * /api/v1/teacher:
   *   post:
   *     tags: ['Teacher']
   *     summary: Register teacher.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *              first_name:
   *                type: string
   *              last_name:
   *                type: string
   *              email:
   *                type: string
   *              phone_number:
   *                type: string
   *              role_id:
   *                type: number
   *              gender:
   *                type: string
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
   *                      status:
   *                        type: boolean
   *                      is_email_verified:
   *                        type: boolean
   *                      is_phone_verified:
   *                        type: boolean
   *                      id:
   *                        type: number
   *                      email:
   *                        type: string
   *                      phone_number:
   *                        type: string
   *                      role_id:
   *                        type: number
   *                      createdBy:
   *                        type: number
   *                      updatedBy:
   *                        type: number
   *                      updatedAt:
   *                        type: string
   *                      createdAt:
   *                        type: string
   *                      teacher:
   *                        type: object
   *                        properties:
   *                          id:
   *                            type: number
   *                          first_name:
   *                            type: string
   *                          last_name:
   *                            type: string
   *                          gender:
   *                            type: string
   *                          createdBy:
   *                            type: number
   *                          updatedBy:
   *                            type: number
   *                          user_id:
   *                            type: number
   *                          updatedAt:
   *                            type: string
   *                          createdAt:
   *                            type: string
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
   *         description: District doen't exist.
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
  createTeacher: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const { id } = req.user;
      let response = await teacherService.createTeacher(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/teacher/file:
   *   post:
   *     tags: ['Teacher']
   *     summary: Create teacher from file.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               file_name:
   *                 type: string
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
   *                               role_title:
   *                                 type: string
   *                               first_name:
   *                                 type: string
   *                               last_name:
   *                                 type: string
   *                               email:
   *                                 type: string
   *                               phone_number:
   *                                 type: number
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
   *                               role_title:
   *                                 type: string
   *                               first_name:
   *                                 type: string
   *                               last_name:
   *                                 type: string
   *                               email:
   *                                 type: string
   *                               phone_number:
   *                                 type: number
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
  createTeacherFromFile: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const { id } = req.user;
      let response = await teacherService.createTeacherFromFile(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/teacher:
   *   get:
   *     tags: ['Teacher']
   *     summary: Get all teacher.
   *     responses:
   *       200:
   *         description: Teachers fetched.
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
   *                     count:
   *                      type: number
   *                     rows:
   *                      type: array
   *                      items:
   *                       type: object
   *                       properties:
   *                        id:
   *                          type: number
   *                        parent_role_id:
   *                          type: number
   *                        email:
   *                          type: string
   *                        phone_number:
   *                          type: string
   *                        status:
   *                          type: boolean
   *                        profile_image:
   *                          type: string
   *                        is_email_verified:
   *                          type: boolean
   *                        is_phone_verified:
   *                          type: boolean
   *                        createdBy:
   *                          type: number
   *                        updatedBy:
   *                          type: number
   *                        createdAt:
   *                          type: string
   *                        updatedAt:
   *                          type: string
   *                        teacher:
   *                          type: object
   *                          properties:
   *                            id:
   *                              type: number
   *                            user_id:
   *                              type: number
   *                            district_id:
   *                              type: number
   *                            school_id:
   *                              type: number
   *                            first_name:
   *                              type: string
   *                            last_name:
   *                              type: string
   *                            address:
   *                              type: string
   *                            gender:
   *                              type: string
   *                            contact_person_image:
   *                              type: string
   *                            contact_person_name:
   *                              type: string
   *                            contact_person_number:
   *                              type: string
   *                            contact_person_email:
   *                              type: string
   *                            contact_person_gender:
   *                              type: string
   *                            emergency_contact_number:
   *                              type: string
   *                            date:
   *                              type: string
   *                            package_id:
   *                              type: number
   *                            createdBy:
   *                              type: number
   *                            updatedBy:
   *                              type: number
   *                            createdAt:
   *                              type: string
   *                            updatedAt:
   *                              type: string
   *                        role:
   *                          type: object
   *                          properties:
   *                            id:
   *                              type: number
   *                            title:
   *                              type: string
   *                            description:
   *                              type: string
   *                            status:
   *                              type: boolean
   *                            createdBy:
   *                              type: number
   *                            updatedBy:
   *                              type: number
   *                            createdAt:
   *                              type: string
   *                            updatedAt:
   *                              type: string
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
  getAllTeachers: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await teacherService.getAllTeachers(req, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/teacher/{id}:
   *   get:
   *     tags: ['Teacher']
   *     summary: Get teacher.
   *     responses:
   *       200:
   *         description: Teacher fetched.
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
   *                        id:
   *                          type: number
   *                        parent_role_id:
   *                          type: number
   *                        email:
   *                          type: string
   *                        phone_number:
   *                          type: string
   *                        status:
   *                          type: boolean
   *                        profile_image:
   *                          type: string
   *                        is_email_verified:
   *                          type: boolean
   *                        is_phone_verified:
   *                          type: boolean
   *                        createdBy:
   *                          type: number
   *                        updatedBy:
   *                          type: number
   *                        createdAt:
   *                          type: string
   *                        updatedAt:
   *                          type: string
   *                        teacher:
   *                          type: object
   *                          properties:
   *                            id:
   *                              type: number
   *                            user_id:
   *                              type: number
   *                            district_id:
   *                              type: number
   *                            school_id:
   *                              type: number
   *                            first_name:
   *                              type: string
   *                            last_name:
   *                              type: string
   *                            address:
   *                              type: string
   *                            gender:
   *                              type: string
   *                            contact_person_image:
   *                              type: string
   *                            contact_person_name:
   *                              type: string
   *                            contact_person_number:
   *                              type: string
   *                            contact_person_email:
   *                              type: string
   *                            contact_person_gender:
   *                              type: string
   *                            emergency_contact_number:
   *                              type: string
   *                            date:
   *                              type: string
   *                            package_id:
   *                              type: number
   *                            createdBy:
   *                              type: number
   *                            updatedBy:
   *                              type: number
   *                            createdAt:
   *                              type: string
   *                            updatedAt:
   *                              type: string
   *                        role:
   *                          type: object
   *                          properties:
   *                            id:
   *                              type: number
   *                            title:
   *                              type: string
   *                            description:
   *                              type: string
   *                            status:
   *                              type: boolean
   *                            createdBy:
   *                              type: number
   *                            updatedBy:
   *                              type: number
   *                            createdAt:
   *                              type: string
   *                            updatedAt:
   *                              type: string
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
  getTeacher: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      let response = await teacherService.getTeacher(param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/teacher/:id:
   *   put:
   *     tags: ['Teacher']
   *     summary: Update teacher details.
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       schema:
   *        type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *     responses:
   *       200:
   *         description: Teacher details updated successfully.
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
   *                   type: array
   *                   items: integer
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
  updateTeacher: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      const reqBody = req.body;
      let response = await teacherService.updateTeacher(reqBody, param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  createGroup: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const { id } = req.user;
      let response = await teacherService.createGroup(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  editGroup: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const { id } = req.user;
      const param_id = req.params.id;
      let response = await teacherService.editGroup(reqBody, param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getGroupNames: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;

      let response = await teacherService.getGroupNames(param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getNonGroupStudents: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      let response = await teacherService.getNonGroupStudents(req, param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getGroupsByClass: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await teacherService.getGroupsByClass(req, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  deleteGroup: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      let response = await teacherService.deleteGroup(param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  checkColorAndTitleConflict: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await teacherService.checkColorAndTitleConflict(req.body, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  }
};
