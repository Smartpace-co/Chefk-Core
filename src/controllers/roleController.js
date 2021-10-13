"use strict";

let roleService = require("../service/roleService");
let { StatusCodes } = require("http-status-codes");

module.exports = {
  /**
   * @swagger
   * /api/v1/checkRoleNameConflict:
   *   post:
   *     tags: ['Role']
   *     summary: Check role name conflict.
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
   *         description: No role name conflictl.
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
   *         description: Role name conflict.
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
  checkRoleNameConflict: async (req, res, next) => {
    try {
      const { name } = req.body;
      let response = await roleService.checkRoleNameConflict(name);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/role/:
   *   post:
   *     tags: ['Role']
   *     summary: Create role.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                type: string
   *               module_ids:
   *                type: array
   *                items:
   *                  type: integer
   *               status:
   *                type: boolean
   *     responses:
   *       200:
   *         description: Role created successfully.
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
   *                         type: integer
   *                       title:
   *                         type: string
   *                       status:
   *                         type: boolean
   *                       isMaster:
   *                         type: boolean
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
   *         description: Role aleady exists.
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
  createRole: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const { id } = req.user;
      let response = await roleService.createRole(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/masterRole:
   *   get:
   *     tags: ['Role']
   *     summary: Get all master roles.
   *     security: []
   *     responses:
   *       200:
   *         description: All master roles fetched successfully.
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
   *                   items:
   *                      type: object
   *                      properties:
   *                       id:
   *                         type: integer
   *                       title:
   *                         type: string
   *                       description:
   *                         type: string
   *                       isMaster:
   *                         type: boolean
   *                       status:
   *                         type: boolean
   *                       access_modules:
   *                         type: array
   *                         items:
   *                           type: object
   *                           properties:
   *                              id:
   *                                type: integer
   *                              title:
   *                                type: string
   *                              description:
   *                                type: string
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
  getAllMasterRoles: async (req, res, next) => {
    try {
      let response = await roleService.getAllMasterRoles(req);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/masterRole/:id:
   *   get:
   *     tags: ['Role']
   *     summary: Get master role by id.
   *     security: []
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       schema:
   *        type: integer
   *     responses:
   *       200:
   *         description: Master role fetched successfully.
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
   *                         type: integer
   *                       title:
   *                         type: string
   *                       description:
   *                         type: string
   *                       isMaster:
   *                         type: boolean
   *                       status:
   *                         type: boolean
   *                       access_modules:
   *                         type: array
   *                         items:
   *                           type: object
   *                           properties:
   *                              id:
   *                                type: integer
   *                              title:
   *                                type: string
   *                              description:
   *                                type: string
   *
   *       404:
   *         description: Master role does not exist.
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
  getMasterRole: async (req, res, next) => {
    try {
      const id = req.params.id;
      let response = await roleService.getMasterRole(id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/role:
   *   get:
   *     tags: ['Role']
   *     summary: Get all roles.
   *     responses:
   *       200:
   *         description: All Role fetched successfully.
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
   *                           type: object
   *                           properties:
   *                            id:
   *                              type: integer
   *                            title:
   *                              type: string
   *                            description:
   *                              type: string
   *                            isMaster:
   *                              type: boolean
   *                            status:
   *                              type: boolean
   *                            access_modules:
   *                              type: array
   *                              items:
   *                                type: object
   *                                properties:
   *                                   id:
   *                                     type: integer
   *                                   title:
   *                                     type: string
   *                                   description:
   *                                     type: string
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
  getAllRoles: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await roleService.getAllRoles(req, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/role/:id:
   *   get:
   *     tags: ['Role']
   *     summary: Get role by id.
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *     - in: query
   *       name: status
   *       schema:
   *        type: integer
   *     responses:
   *       200:
   *         description: Role fetched successfully.
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
   *                         type: integer
   *                       title:
   *                         type: string
   *                       description:
   *                         type: string
   *                       isMaster:
   *                         type: boolean
   *                       status:
   *                         type: boolean
   *                       access_modules:
   *                         type: array
   *                         items:
   *                           type: object
   *                           properties:
   *                              id:
   *                                type: integer
   *                              title:
   *                                type: string
   *                              description:
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
   *       404:
   *         description: Role does not exist.
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
  getRole: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      let response = await roleService.getRole(param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/userrole/:id:
   *   get:
   *     tags: ['Role']
   *     summary: Get user role by user id.
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *     responses:
   *       200:
   *         description: Role fetched successfully.
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
   *                       userId:
   *                         type: integer
   *                       roleId:
   *                         type: integer
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
  getUserRole: async (req, res, next) => {
    try {
      const param_id = req.params.id;
      let response = await roleService.getUserRole(param_id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/role/:
   *   put:
   *     tags: ['Role']
   *     summary: Update role.
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
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
   *               module_ids:
   *                type: array
   *                items:
   *                  type: integer
   *               status:
   *                type: boolean
   *     responses:
   *       200:
   *         description: Role details updated successfully.
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
   *                         type: integer
   *                       title:
   *                         type: string
   *                       description:
   *                         type: string
   *                       status:
   *                         type: boolean
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
   *         description: Role does not exist.
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
  updateRole: async (req, res, next) => {
    try {
      const { id } = req.user;
      const reqBody = req.body;
      const param_id = req.params.id;
      let response = await roleService.updateRole(param_id, reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/role/:id:
   *   delete:
   *     tags: ['Role']
   *     summary: DISABLED ROUTE Delete role.
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       schema:
   *        type: integer
   *     responses:
   *       200:
   *         description: Role details updated successfully.
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
   *                   type: integer
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
  deleteRole: async (req, res, next) => {
    try {
      const { id } = req.user;
      let param_id = req.params.id;
      let response = await roleService.deleteRole(param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
};
