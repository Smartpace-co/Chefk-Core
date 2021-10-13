"use strict";

const miniGameService = require("../service/miniGameService");

module.exports = {
  /**
   * @swagger
   * /api/v1/minigame/imagedragdrop:
   *   get:
   *     tags: ['Mini Games Service']
   *     summary: Get questions of image drag and drop mini game.
   *     responses:
   *       200:
   *         description: Questions fetched successfully.
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
   *                       level:
   *                         type: number
   *                       subQuestions:
   *                         type: array
   *                         items:
   *                            type: object
   *                            properties:
   *                              id:
   *                               type: number
   *                              question:
   *                               type: string
   *                       options:
   *                         type: array
   *                         items:
   *                            type: object
   *                            properties:
   *                              id:
   *                               type: number
   *                              src:
   *                               type: string
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
  imageDragDrop: async (req, res, next) => {
    try {
      let response = await miniGameService.imageDragDrop();
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/minigame/flagmatch:
   *   get:
   *     tags: ['Mini Games Service']
   *     summary: Get questions of flag match mini game.
   *     responses:
   *       200:
   *         description: Questions fetched successfully.
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
   *                       level:
   *                         type: number
   *                       questionCountry:
   *                         type: object
   *                         properties:
   *                           id:
   *                            type: number
   *                           countryName:
   *                            type: string
   *                           status:
   *                            type: boolean
   *                           systemLanguageId:
   *                            type: number
   *                       optionFlags:
   *                         type: array
   *                         items:
   *                            type: object
   *                            properties:
   *                              id:
   *                               type: number
   *                              image:
   *                               type: string
   *                              status:
   *                                type: boolean
   *                              transactionId:
   *                                type: number
   *                              isAnswer:
   *                                type: boolean
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
  flagMatch: async (req, res, next) => {
    try {
      let response = await miniGameService.flagMatch();
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/minigame/imageFlip:
   *   get:
   *     tags: ['Mini Games Service']
   *     summary: Get questions of image flip mini game.
   *     responses:
   *       200:
   *         description: Questions fetched successfully.
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
   *                       level:
   *                         type: number
   *                       options:
   *                         type: array
   *                         items:
   *                            type: object
   *                            properties:
   *                              id:
   *                               type: number
   *                              src:
   *                               type: string
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
  imageFlip: async (req, res, next) => {
    try {
      let response = await miniGameService.imageFlip();
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
};
