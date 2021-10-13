"use strict";

let districtUserService = require("../service/districtUserService");
let { StatusCodes } = require("http-status-codes");

module.exports = {
  /**
   * @swagger
   * /api/v1/districtUser:
   *   post:
   *     tags: ['District User']
   *     summary: Create district user.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               role_id:
   *                 type: number
   *               first_name:
   *                 type: string
   *               last_name:
   *                 type: string
   *               email:
   *                 type: string
   *               phone_number:
   *                 type: string
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
   *                    status:
   *                      type: boolean
   *                    is_email_verified:
   *                      type: boolean
   *                    is_phone_verified:
   *                      type: boolean
   *                    id:
   *                      type: number
   *                    role_id:
   *                      type: number
   *                    email:
   *                      type: string
   *                    phone_number:
   *                      type: string
   *                    parent_role_id:
   *                      type: number
   *                    createdBy:
   *                      type: number
   *                    updatedBy:
   *                      type: number
   *                    updatedAt:
   *                      type: string
   *                    createdAt:
   *                      type: string
   *                    district_user:
   *                      type: object
   *                      properties:
   *                        id:
   *                          type: number
   *                        first_name:
   *                          type: string
   *                        last_name:
   *                          type: string
   *                        user_id:
   *                          type: number
   *                        district_id:
   *                          type: number
   *                        createdBy:
   *                          type: number
   *                        updatedBy:
   *                          type: number
   *                        updatedAt:
   *                          type: string
   *                        createdAt:
   *                          type: string
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
   *         description: District do not exist.
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
  createDistrictUser: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const { id } = req.user;
      let response = await districtUserService.createDistrictUser(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/districtUser/file:
   *   post:
   *     tags: ['District User']
   *     summary: Create district users from file.
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
   *                               status:
   *                                 type: boolean
   *                               role_id:
   *                                 type: number
   *                               updatedBy:
   *                                 type: number
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
   *                               status:
   *                                 type: boolean
   *                               role_id:
   *                                 type: number
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
   *         description: District do not exist.
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
  createDistrictUserFromFile: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const { id } = req.user;
      let response = await districtUserService.createDistrictUserFromFile(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/districtUser:
   *   get:
   *     tags: ['District User']
   *     summary: Get all district users.
   *     responses:
   *       200:
   *         description: District users fetched.
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
   *                      type: number
   *                    rows:
   *                      type: array
   *                      items:
   *                        type: object
   *                        properties:
   *                          id:
   *                            type: number
   *                          role_id:
   *                            type: number
   *                          parent_role_id:
   *                            type: number
   *                          email:
   *                            type: string
   *                          phone_number:
   *                            type: string
   *                          status:
   *                            type: boolean
   *                          profile_image:
   *                            type: string
   *                            format: nullable
   *                          is_email_verified:
   *                            type: boolean
   *                          is_phone_verified:
   *                            type: boolean
   *                          createdBy:
   *                            type: number
   *                          updatedBy:
   *                            type: number
   *                          createdAt:
   *                            type: string
   *                          updatedAt:
   *                            type: string
   *                          details:
   *                            type: object
   *                            properties:
   *                              id:
   *                                type: number
   *                              user_id:
   *                                type: number
   *                              district_id:
   *                                type: number
   *                              first_name:
   *                                type: string
   *                              last_name:
   *                                type: string
   *                              address:
   *                                type: string
   *                                format: nullable
   *                              gender:
   *                                type: string
   *                                format: nullable
   *                              package_id:
   *                                type: string
   *                                format: nullable
   *                              createdBy:
   *                                type: number
   *                              updatedBy:
   *                                type: number
   *                              createdAt:
   *                                type: string
   *                              updatedAt:
   *                                type: string
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
   *         description: District do not exist.
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
  getAllDistrictUsers: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await districtUserService.getAllDistrictUsers(req, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/districtUser/{id}:
   *   get:
   *     tags: ['District User']
   *     summary: Get district user.
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       type: string
   *     responses:
   *       200:
   *         description: District user fetched.
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
   *                          id:
   *                            type: number
   *                          role_id:
   *                            type: number
   *                          parent_role_id:
   *                            type: number
   *                          email:
   *                            type: string
   *                          phone_number:
   *                            type: string
   *                          status:
   *                            type: boolean
   *                          profile_image:
   *                            type: string
   *                            format: nullable
   *                          is_email_verified:
   *                            type: boolean
   *                          is_phone_verified:
   *                            type: boolean
   *                          createdBy:
   *                            type: number
   *                          updatedBy:
   *                            type: number
   *                          createdAt:
   *                            type: string
   *                          updatedAt:
   *                            type: string
   *                          details:
   *                            type: object
   *                            properties:
   *                              id:
   *                                type: number
   *                              user_id:
   *                                type: number
   *                              district_id:
   *                                type: number
   *                              first_name:
   *                                type: string
   *                              last_name:
   *                                type: string
   *                              address:
   *                                type: string
   *                                format: nullable
   *                              gender:
   *                                type: string
   *                                format: nullable
   *                              package_id:
   *                                type: string
   *                                format: nullable
   *                              createdBy:
   *                                type: number
   *                              updatedBy:
   *                                type: number
   *                              createdAt:
   *                                type: string
   *                              updatedAt:
   *                                type: string
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
   *         description: District do not exist.
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
  getDistrictUser: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      let response = await districtUserService.getDistrictUser(id, param_id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/districtUser/profiles:
   *   get:
   *     tags: ['District User']
   *     summary: Get district user profile.
   *     parameters:
   *     responses:
   *       200:
   *         description: District user profile fetched.
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
   *                      type: number
   *                    parent_role_id:
   *                      type: number
   *                    email:
   *                      type: string
   *                    phone_number:
   *                      type: string
   *                    status:
   *                      type: boolean
   *                    profile_image:
   *                      type: string
   *                      format: nullable
   *                    is_email_verified:
   *                      type: boolean
   *                    is_phone_verified:
   *                      type: boolean
   *                    createdBy:
   *                      type: number
   *                    updatedBy:
   *                      type: number
   *                    createdAt:
   *                      type: string
   *                    updatedAt:
   *                      type: string
   *                    details:
   *                      type: object
   *                      properties:
   *                        id:
   *                          type: number
   *                        user_id:
   *                          type: number
   *                        district_id:
   *                          type: number
   *                        first_name:
   *                          type: string
   *                        last_name:
   *                          type: string
   *                        address:
   *                          type: string
   *                          format: nullable
   *                        gender:
   *                          type: string
   *                          format: nullable
   *                        package_id:
   *                          type: string
   *                          format: nullable
   *                        createdBy:
   *                          type: number
   *                        updatedBy:
   *                          type: number
   *                        createdAt:
   *                          type: string
   *                        updatedAt:
   *                          type: string
   *                    role:
   *                      type: object
   *                      properties:
   *                        id:
   *                          type: number
   *                        title:
   *                          type: string
   *                        description:
   *                          type: string
   *                          format: nullable
   *                        status:
   *                          type: boolean
   *                        createdBy:
   *                          type: string
   *                          format: nullable
   *                        updatedBy:
   *                          type: string
   *                          format: nullable
   *                        createdAt:
   *                          type: string
   *                        updatedAt:
   *                          type: string
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
   *         description: District user not found.
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
  getDistrictUserProfile: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await districtUserService.getDistrictUserProfile(id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/districtUser/{id}:
   *   put:
   *     tags: ['District User']
   *     summary: Update district user.
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       type: string
   *     responses:
   *       200:
   *         description: Update district user.
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
   *                    user:
   *                      type: number
   *                    district:
   *                      type: number
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
   *         description: District do not exist.
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
  updateDistrictUser: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      const reqBody = req.body;
      let response = await districtUserService.updateDistrictUser(id, param_id, reqBody);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/districtUser/profile:
   *   put:
   *     tags: ['District User']
   *     summary: Update district user.
   *     responses:
   *       200:
   *         description: Update district user profile.
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
   *                    user:
   *                      type: number
   *                    district:
   *                      type: number
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
   *         description: District do not exist.
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
  updateDistrictUserProfile: async (req, res, next) => {
    try {
      const { id } = req.user;
      const reqBody = req.body;
      let response = await districtUserService.updateDistrictUserProfile(id, reqBody);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
};
