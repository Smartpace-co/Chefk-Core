"use strict";

let recipeService = require("../service/recipeService");

module.exports = {
  /**
   * @swagger
   * /api/v1/recipe:
   *   get:
   *     tags: ['Recipe Service']
   *     summary: Get all recipies.
   *     parameters:
   *     - in: query
   *       name: country
   *       schema:
   *        type: string
   *     - in: query
   *       name: lessonId
   *       schema:
   *        type: string
   *     responses:
   *       200:
   *         description: Recipies fetched successfully.
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
   *                     type: array
   *                     items:
   *                      type: object
   *                      properties:
   *                       id:
   *                         type: number
   *                       recipeTitle:
   *                         type: string
   *                       holiday:
   *                         type: string
   *                       alternativeName:
   *                         type: string
   *                       estimatedMakeTime:
   *                         type: string
   *                       recipeImage:
   *                         type: string
   *                       serves:
   *                         type: number
   *                       countryId:
   *                         type: number
   *                       lessonId:
   *                         type: number
   *                       preparationStepsTrack:
   *                         type: string
   *                       cookingStepsTrack:
   *                         type: string
   *                       servingStepsTrack:
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
  getAllRecipies: async (req, res, next) => {
    try {
      let response = await recipeService.getAllRecipies(req);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
};
