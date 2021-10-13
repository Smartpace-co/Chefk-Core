"use strict";

let schoolUserService = require("../service/schoolUserService");
let { StatusCodes } = require("http-status-codes");

module.exports = {
  /**
   * @swagger
   * /api/v1/:
   *   post:
   *     tags: ['School User']
   *     summary: Register school.
   *     parameters:
   *     - in: header
   *       name: token
   *       required: true
   *       type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               admin_account_name:
   *                 type: string
   *               email:
   *                 type: string
   *               phone_number:
   *                 type: string
   *               role_id:
   *                 type: integer
   *               school_address:
   *                 type: string
   *               contact_person_name:
   *                 type: string
   *               contact_person_number:
   *                 type: string
   *               contact_person_email:
   *                 type: string
   *               contact_person_address:
   *                 type: string
   *               emergency_contact_number:
   *                 type: string
   *               date:
   *                 type: date
   *               max_user:
   *                 type: integer
   *               package_id:
   *                 type: integer
   *               status:
   *                 type: boolean
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
   *                       is_email_verified:
   *                         type: string
   *                       is_phone_verified:
   *                         type: string
   *                       id:
   *                          type: integer
   *                       role_id:
   *                         type: integer
   *                       email:
   *                         type: string
   *                       phone_number:
   *                         type: string
   *                       status:
   *                         type: boolean
   *                       user_id:
   *                         type: integer
   *                       name:
   *                         type: string
   *                       district_id:
   *                          type: string
   *                       admin_account_name:
   *                         type: string
   *                       school_address:
   *                          type: string
   *                       contact_person_name:
   *                         type: string
   *                       contact_person_no:
   *                         type: string
   *                       contact_person_email:
   *                         type: string
   *                       emergency_contact_number:
   *                         type: string
   *                       date:
   *                         type: date
   *                       max_user:
   *                          type: integer
   *                       package_id:
   *                         type: integer
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
   *                 error :
   *                   type: string
   *       409:
   *         description: School already exist.
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

  createSchoolUser: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const { id } = req.user;
      let response = await schoolUserService.createSchoolUser(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  createSchoolUserFromFile: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const { id } = req.user;
      let response = await schoolUserService.createSchoolUserFromFile(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  getAllSchoolUsers: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await schoolUserService.getAllSchoolUsers(req, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  getSchoolUser: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      let response = await schoolUserService.getSchoolUser(id, param_id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  getSchoolUserProfile: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await schoolUserService.getSchoolUserProfile(id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  updateSchoolUser: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      const reqBody = req.body;
      let response = await schoolUserService.updateSchoolUser(id, param_id, reqBody);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  updateSchoolUserProfile: async (req, res, next) => {
    try {
      const { id } = req.user;
      const reqBody = req.body;
      let response = await schoolUserService.updateSchoolUserProfile(id, reqBody);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
};
