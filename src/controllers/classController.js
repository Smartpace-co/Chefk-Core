"use strict";

let classService = require("../service/classService");
let { StatusCodes } = require("http-status-codes");

module.exports = {
  /**
   * @swagger
   * /api/v1/checkClassNameConflict:
   *   post:
   *     tags: ['Class']
   *     summary: Check class name conflict.
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
   *         description: No class name conflictl.
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
   *         description: class name conflict.
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
  checkClassNameConflict: async (req, res, next) => {
    try {
      const { name } = req.body;
      let response = await classService.checkClassNameConflict(name);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/class:
   *   post:
   *     tags: ['Class']
   *     summary: Create class.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                type: string
   *               district_id:
   *                type: number
   *               school_id:
   *                type: number
   *               description:
   *                type: string
   *               grade_id:
   *                type: number
   *               assigned_teacher_ids:
   *                type: array
   *                items:
   *                  type: number
   *               assigned_standard_subject_group_ids:
   *                type: array
   *                items:
   *                  type: number
   *               assigned_standard_ids:
   *                type: array
   *                items:
   *                  type: number
   *               assigned_student_ids:
   *                type: array
   *                items:
   *                  type: number
   *               number_of_students:
   *                type: number
   *               parent_id:
   *                type: number
   *               status:
   *                type: boolean
   *     responses:
   *       200:
   *         description: Class created and email send successfully.
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
   *                    id:
   *                       type: number
   *                    title:
   *                       type: string
   *                    district_id:
   *                       type: number
   *                    school_id:
   *                       type: number
   *                    description:
   *                       type: string
   *                    grade_id:
   *                       type: number
   *                    assigned_teacher_ids:
   *                       type: array
   *                       items:
   *                         type: number
   *                    assigned_standard_ids:
   *                       type: array
   *                       items:
   *                         type: number
   *                    assigned_student_ids:
   *                       type: array
   *                       items:
   *                         type: number
   *                    number_of_students:
   *                       type: number
   *                    parent_id:
   *                       type: number
   *                    status:
   *                       type: boolean
   *                    access_code:
   *                       type: string
   *       400:
   *         description: Class already exists.
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
  createClass: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const { id } = req.user;
      let response = await classService.createClass(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/classBySchool/{schoolId}:
   *   get:
   *     tags: ['Class']
   *     summary: Get class by school id.
   *     parameters:
   *     - in: path
   *       name: schoolId
   *       required: true
   *       type: string
   *     responses:
   *       200:
   *         description: Class fetched successfully.
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
   *                   type : array
   *                   items:
   *                      type: object
   *                      properties:
   *                        id:
   *                          type: number
   *                        title:
   *                          type: string
   *                        district_id:
   *                          type: number
   *                        school_id:
   *                          type: number
   *                        status:
   *                          type: boolean
   *                        created_by:
   *                          type: number
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

  getClassesBySchool: async (req, res, next) => {
    try {
      const id = req.user;
      const param_id = req.params.schoolId;
      let response = await classService.getClassesBySchool(param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/class:
   *   get:
   *     tags: ['Class']
   *     summary: Get all class.
   *     responses:
   *       200:
   *         description: Classes fetched successfully.
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
   *                    count:
   *                     type: number
   *                    rows:
   *                     type : array
   *                     items:
   *                      type: object
   *                      properties:
   *                        id:
   *                         type: number
   *                        district_id:
   *                         type : number
   *                        school_id:
   *                         type: number
   *                        parent_id:
   *                         type : number
   *                        teacher_id:
   *                         type: number
   *                        class_owner_id:
   *                         type: number
   *                        title:
   *                         type: string
   *                        description:
   *                         type: string
   *                        number_of_students:
   *                         type: number
   *                        access_code:
   *                         type: string
   *                        date:
   *                         type: date
   *                        status:
   *                         type: boolean
   *                        archived_at:
   *                         type: string
   *                        deleted_at:
   *                         type: string
   *                        createdBy:
   *                         type: number
   *                        updatedBy:
   *                         type: number
   *                        createdAt:
   *                         type: string
   *                        updatedAt:
   *                         type: string
   *                        grade:
   *                         type: object
   *                        school:
   *                         type: object
   *                        class_standard_subject_groups:
   *                         type: array
   *                         items:
   *                          type: object
   *                        class_standards:
   *                         type: array
   *                         items:
   *                          type: object
   *                        class_teachers:
   *                         type: array
   *                         items:
   *                          type: object
   *                        class_students:
   *                         type: array
   *                         items:
   *                          type: object
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

  getAllClasses: async (req, res, next) => {
    try {
      const { id, isStudent } = req.user;
      let response = await classService.getAllClasses(req, id, isStudent);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/class/{id}:
   *   get:
   *     tags: ['Class']
   *     summary: Get class.
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       type: string
   *     responses:
   *       200:
   *         description: Class fetched successfully.
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
   *                         type: number
   *                        district_id:
   *                         type : number
   *                        school_id:
   *                         type: number
   *                        parent_id:
   *                         type: number
   *                        teacher_id:
   *                         type: number
   *                        class_owner_id:
   *                         type: number
   *                        title:
   *                         type: string
   *                        description:
   *                         type: string
   *                        number_of_students:
   *                         type: number
   *                        access_code:
   *                         type: string
   *                        date:
   *                         type: date
   *                        status:
   *                         type: boolean
   *                        archived_at:
   *                         type: sting
   *                        deleted_at:
   *                         type: string
   *                        createdBy:
   *                         type: number
   *                        updatedBy:
   *                         type: number
   *                        createdAt:
   *                         type: string
   *                        updatedAt:
   *                         type: string
   *                        grade:
   *                         type: object
   *                        school:
   *                         type: object
   *                        class_standard_subject_groups:
   *                         type: array
   *                         items:
   *                          type: object
   *                        class_standards:
   *                         type: array
   *                         items:
   *                          type: object
   *                        class_teachers:
   *                         type: array
   *                         items:
   *                          type: object
   *                        class_students:
   *                         type: array
   *                         items:
   *                          type: object
   *                        classOwner:
   *                          type: object
   *                          properties:
   *                            name:
   *                              type: string
   *       400:
   *         description: Class does not exist.
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
  getClass: async (req, res, next) => {
    try {
      const { id, isStudent } = req.user;
      const param_id = req.params.id;
      let response = await classService.getClass(param_id, id, isStudent);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/class/{id}:
   *   put:
   *     tags: ['Class']
   *     summary: Update class.
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                type: string
   *               description:
   *                type: string
   *               grade_id:
   *                type: number
   *               assigned_teacher_ids:
   *                type: array
   *                items:
   *                  type: number
   *               assigned_standard_ids:
   *                type: array
   *                items:
   *                  type: number
   *               assigned_student_ids:
   *                type: array
   *                items:
   *                  type: number
   *               number_of_students:
   *                type: number
   *               school_id:
   *                type: number
   *               status:
   *                type: boolean
   *     responses:
   *       200:
   *         description: Class details updated successfully.
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
   *                         type: number
   *                        district_id:
   *                         type : number
   *                        school_id:
   *                         type: number
   *                        teacher_id:
   *                         type: number
   *                        class_owner_id:
   *                         type: number
   *                        title:
   *                         type: string
   *                        description:
   *                         type: string
   *                        number_of_students:
   *                         type: number
   *                        access_code:
   *                         type: string
   *                        date:
   *                         type: date
   *                        status:
   *                         type: boolean
   *                        archived_at:
   *                         type: sting
   *                        deleted_at:
   *                         type: string
   *                        createdBy:
   *                         type: number
   *                        updatedBy:
   *                         type: number
   *                        createdAt:
   *                         type: string
   *                        updatedAt:
   *                         type: string
   *                        grade_id:
   *                         type: number
   *                        assigned_standard_subject_group_ids:
   *                         type: array
   *                         items:
   *                          type: number
   *                        assigned_standard_ids:
   *                         type: array
   *                         items:
   *                          type: number
   *                        assigned_teacher_ids:
   *                         type: array
   *                         items:
   *                          type: number
   *       400:
   *         description: Class does not exist.
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
  updateClass: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      const reqBody = req.body;
      let response = await classService.updateClass(reqBody, param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/class/archive/{id}:
   *   put:
   *     tags: ['Class']
   *     summary: Archive class.
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       type: string
   *     responses:
   *       200:
   *         description: Class archived successfully.
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
   *                        result:
   *                         type: array
   *                         items:
   *                          type : number
   *       400:
   *         description: Class does not exist.
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
  archiveClass: async (req, res, next) => {
    try {
      const { id } = req.user;
      let param_id = req.params.id;
      let response = await classService.archiveClass(param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/class/unArchive/{id}:
   *   put:
   *     tags: ['Class']
   *     summary: Unarchive class.
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       type: string
   *     responses:
   *       200:
   *         description: Class unarchived successfully.
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
   *                        result:
   *                         type: array
   *                         items:
   *                          type : number
   *       400:
   *         description: Class does not exist.
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
  unArchiveClass: async (req, res, next) => {
    try {
      const { id } = req.user;
      let param_id = req.params.id;
      let response = await classService.unArchiveClass(param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/class/delete/{id}:
   *   delete:
   *     tags: ['Class']
   *     summary: Delete class.
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       type: string
   *     responses:
   *       200:
   *         description: Class deleted successfully.
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
   *                        result:
   *                         type: array
   *                         items:
   *                          type : number
   *       400:
   *         description: Class does not exist.
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
  deleteClass: async (req, res, next) => {
    try {
      const { id } = req.user;
      let param_id = req.params.id;
      let response = await classService.deleteClass(param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  joinClass: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const { id } = req.user;
      let response = await classService.joinClass(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getClassCount: async (req, res, next) => {
    try {
      let id = req.query.id;
      let roleId = req.query.roleId;
      let packageId = req.query.packageId;

      let response = await classService.getClassCount(id, roleId, packageId);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getAllDeletedClasses: async (req, res, next) => {
    try {
      let response = await classService.getAllDeletedClasses(req);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
};
