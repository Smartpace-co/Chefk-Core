"use strict";

let settingService = require("../service/settingService");
let { StatusCodes } = require("http-status-codes");

module.exports = {
  /**
   * @swagger
   * /api/v1/settings:
   *   get:
   *     tags: ['Setting']
   *     summary: Get settings.
   *     parameters:
   *     - in: param
   *       name: entityId
   *       schema:
   *        type: number
   *     - in: query
   *       name: role_id
   *       schema:
   *        type: number
   *     responses:
   *       200:
   *         description: Settings fetched.
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
   *                         type: number
   *                       entityId:
   *                         type: number
   *                       roleId:
   *                         type: number
   *                       key:
   *                         type: string
   *                       isEnable:
   *                         type: boolean
   *                       content:
   *                         type: array
   *                         items:
   *                           type: number
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
  getSettings: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { entityId } = req.params;
      let response = await settingService.getSettings(req, id, entityId);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/preferedlanguage:
   *   get:
   *     tags: ['Setting']
   *     summary: Get prefered language.
   *     parameters:
   *     - in: param
   *       name: entityId
   *       schema:
   *        type: number
   *     - in: query
   *       name: role_id
   *       schema:
   *        type: number
   *     responses:
   *       200:
   *         description: Prefered language fetched.
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
   *                      type: object
   *                      properties:
   *                       id:
   *                         type: string
   *                       title:
   *                         type: string
   *                       key:
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
  getPreferedLanguage: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { entityId } = req.params;
      let response = await settingService.getPreferedLanguage(req, id, entityId);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/settings:
   *   put:
   *     tags: ['Setting']
   *     summary: Get settings.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               settings:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                      id:
   *                        type: number
   *                      isEnable:
   *                        type: boolean
   *                      content:
   *                        type: array
   *                        items:
   *                           type: number
   *     responses:
   *       200:
   *         description: Settings fetched.
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
   *                         type: number
   *                       entityId:
   *                         type: number
   *                       roleId:
   *                         type: number
   *                       key:
   *                         type: string
   *                       isEnable:
   *                         type: boolean
   *                       content:
   *                         type: array
   *                         items:
   *                           type: number
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
  updateSettings: async (req, res, next) => {
    try {
      const { id, isStudent} = req.user;
      const reqBody = req.body;
      let response = await settingService.updateSettings(reqBody, id, isStudent);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
};
