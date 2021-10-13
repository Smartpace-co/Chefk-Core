"use strict";

let helperService = require("../service/helperService");
let { StatusCodes } = require("http-status-codes");

module.exports = {
  /**
   * @swagger
   * /api/v1/checkEmailConflict:
   *   post:
   *     tags: ['Helper']
   *     summary: Check email conflict.
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
   *         description: No email conflictl.
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
   *         description: Email aready exists.
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
  checkEmailConflict: async (req, res, next) => {
    try {
      const { email } = req.body;
      let response = await helperService.checkEmailConflict(email);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/checkPhoneNumberConflict:
   *   post:
   *     tags: ['Helper']
   *     summary: Check phone number conflict.
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               phone_number:
   *                 type: string
   *     responses:
   *       200:
   *         description: No phone number conflict.
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
   *         description: Phone number aready exists.
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
  checkPhoneNumberConflict: async (req, res, next) => {
    try {
      const { phone_number } = req.body;
      let response = await helperService.checkPhoneNumberConflict(phone_number);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/fileUpload:
   *   post:
   *     tags: ['Helper']
   *     summary: File upload.
   *     parameters:
   *     - in: formData
   *       name: file
   *       required: true
   *
   *     responses:
   *       200:
   *         description: File uploaded successfully.
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
   *                    type: array
   *                    items :
   *                       type: object
   *                       properties:
   *                          mediaName :
   *                            type: string
   *                          origMediaName :
   *                            type: string
   *                          mediaPath :
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
  fileUpload: async (req, res, next) => {
    try {
      let response = await helperService.fileUpload(req, res);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/file:
   *   post:
   *     tags: ['Helper']
   *     summary: Download demo file.
   *     parameters:
   *     - in: path
   *       name: entityType
   *       required: true
   *       type: string
   *     responses:
   *       200:
   *         description: Demo file send successfully.
   *       404:
   *         description: Not found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 error :
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
  getDemoFile: async (req, res, next) => {
    try {
      const { entityType } = req.params;
      await helperService.getDemoFile(req, res, entityType);
    } catch (err) {
      next(err);
    }
  },
};
