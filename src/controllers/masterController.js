"use strict";

let masterService = require("../service/masterService");
let { StatusCodes } = require("http-status-codes");

module.exports = {
  /**
   * @swagger
   * /api/v1/master/grade:
   *   get:
   *     tags: ['Master Service']
   *     security: []
   *     summary: Get all grades.
   *     responses:
   *       200:
   *         description: Grades fetched.
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
   *                       grade:
   *                         type: string
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
  getAllGrades: async (req, res, next) => {
    try {
      let response = await masterService.getAllGrades();
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/master/standard:
   *   get:
   *     tags: ['Master Service']
   *     security: []
   *     summary: Get all grades.
   *     responses:
   *       200:
   *         description: Grades fetched.
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
   *                       standardTitle:
   *                         type: string
   *                       description:
   *                         type: string
   *                       image:
   *                         type: string
   *                       status:
   *                         type: boolean
   *                       subjectId:
   *                         type: number
   *                       systemLanguageId:
   *                         type: number
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
  getAllStandards: async (req, res, next) => {
    try {
      let response = await masterService.getAllStandards();
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/master/ethnicity:
   *   get:
   *     tags: ['Master Service']
   *     summary: Get all ethnicities.
   *     responses:
   *       200:
   *         description: Ethnicities fetched.
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
   *                       tile:
   *                         type: string
   *                       description:
   *                         type: string
   *                         format: nullable
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
  getAllEthnicities: async (req, res, next) => {
    try {
      let response = await masterService.getAllEthnicities();
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/master/relation:
   *   get:
   *     tags: ['Master Service']
   *     summary: Get all relations.
   *     responses:
   *       200:
   *         description: Relations fetched.
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
   *                       title:
   *                         type: string
   *                       description:
   *                         type: string
   *                         format: nullable
   *                       type:
   *                         type: string
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
  getAllRelations: async (req, res, next) => {
    try {
      let response = await masterService.getAllRelations(req);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/master/medicalcondition:
   *   get:
   *     tags: ['Master Service']
   *     summary: Get all grades.
   *     responses:
   *       200:
   *         description: Medical conditions fetched.
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
   *                       title:
   *                         type: string
   *                       description:
   *                         type: string
   *                         format: nullable
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
  getAllMedicalConditions: async (req, res, next) => {
    try {
      let response = await masterService.getAllMedicalConditions();
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/master/faqs:
   *   get:
   *     tags: ['Master Service']
   *     summary: Get all grades.
   *     parameters:
   *     - in: query
   *       name: status
   *       schema:
   *        type: number
   *     - in: query
   *       name: search
   *       schema:
   *        type: string
   *     - in: query
   *       name: page_size
   *       schema:
   *        type: number
   *     - in: query
   *       name: page_no
   *       schema:
   *        type: number
   *     responses:
   *       200:
   *         description: FAQS fetched.
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
   *                        type: object
   *                        properties:
   *                         id:
   *                           type: number
   *                         question:
   *                           type: string
   *                         answer:
   *                           type: string
   *                         status:
   *                           type: boolean
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
  getAllFAQs: async (req, res, next) => {
    try {
      let response = await masterService.getAllFAQs(req);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/master/contactus:
   *   get:
   *     tags: ['Master Service']
   *     summary: Get all grades.
   *     parameters:
   *     - in: query
   *       name: status
   *       schema:
   *        type: number
   *     - in: query
   *       name: page_size
   *       schema:
   *        type: number
   *     - in: query
   *       name: page_no
   *       schema:
   *        type: number
   *     responses:
   *       200:
   *         description: Help contacts fetched.
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
   *                        type: object
   *                        properties:
   *                         id:
   *                           type: number
   *                         title:
   *                           type: string
   *                         email:
   *                           type: string
   *                         phoneNumber:
   *                           type: string
   *                         status:
   *                           type: boolean
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
  getAllHelpContacts: async (req, res, next) => {
    try {
      let response = await masterService.getAllHelpContacts(req);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/master/subject:
   *   get:
   *     tags: ['Master Service']
   *     summary: Get all grades.
   *     parameters:
   *     - in: query
   *       name: status
   *       schema:
   *        type: number
   *     - in: query
   *       name: page_size
   *       schema:
   *        type: number
   *     - in: query
   *       name: page_no
   *       schema:
   *        type: number
   *     responses:
   *       200:
   *         description: Subjects fetched.
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
   *                        type: object
   *                        properties:
   *                         id:
   *                           type: number
   *                         subjectTitle:
   *                           type: string
   *                         description:
   *                           type: string
   *                         uuid:
   *                           type: number
   *                         referenceId:
   *                           type: number
   *                         systemLanguageId:
   *                           type: number
   *                         status:
   *                           type: boolean
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
  getAllSubjects: async (req, res, next) => {
    try {
      let response = await masterService.getAllSubjects(req);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/master/systemlanguage:
   *   get:
   *     tags: ['Master Service']
   *     summary: Get all system languages.
   *     parameters:
   *     - in: query
   *       name: status
   *       schema:
   *        type: number
   *     responses:
   *       200:
   *         description: Languages fetched successfully.
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
   *                       title:
   *                         type: string
   *                       key:
   *                         type: string
   *                       status:
   *                         type: boolean
   *                       is_enable:
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
  getAllSystemLanguages: async (req, res, next) => {
    try {
      let response = await masterService.getAllSystemLanguages(req);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/master/groupcolors:
   *   get:
   *     tags: ['Master Service']
   *     security: []
   *     summary: Get all group colors.
   *     responses:
   *       200:
   *         description: Colors list fetched successfully.
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
   *                       colorName:
   *                         type: string
   *                       hexCode:
   *                         type: string
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
  getAllGroupColors: async (req, res, next) => {
    try {
      let response = await masterService.getAllGroupColors(req);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/master/allergen:
   *   get:
   *     tags: ['Master Service']
   *     summary: Get all allergens.
   *     parameters:
   *     - in: query
   *       name: status
   *       schema:
   *        type: number
   *     responses:
   *       200:
   *         description: Allergens fetched successfully.
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
   *                       allergenTitle:
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
  getAllAllergens: async (req, res, next) => {
    try {
      let response = await masterService.getAllAllergens(req);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/master/language:
   *   get:
   *     tags: ['Master Service']
   *     security: []
   *     summary: Get all language.
   *     responses:
   *       200:
   *         description: Languages fetched successfully.
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
   *                       language:
   *                         type: string
   *                       status:
   *                         type: boolean
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
  getAllLanguages: async (req, res, next) => {
    try {
      let response = await masterService.getAllLanguages(req);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/master/country:
   *   get:
   *     tags: ['Master Service']
   *     security: []
   *     summary: Get all country.
   *     responses:
   *       200:
   *         description: Countries fetched successfully.
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
   *                       countryName:
   *                         type: string
   *                       status:
   *                         type: boolean
   *                       systemLanguageId:
   *                          type: number
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
  getAllCountries: async (req, res, next) => {
    try {
      let response = await masterService.getAllCountries(req);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/master/ingredient:
   *   get:
   *     tags: ['Master Service']
   *     security: []
   *     summary: Get all ingredients.
   *     responses:
   *       200:
   *         description: Ingredients fetched successfully.
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
   *                       ingredientTitle:
   *                         type: string
   *                       easyOrdering:
   *                         type: string
   *                       size:
   *                         type: number
   *                       scientificName:
   *                         type: string
   *                       commonName:
   *                         type: string
   *                       spotlightVideo:
   *                         type: string
   *                       seasonId:
   *                         type: number
   *                       status:
   *                         type: boolean
   *                       systemLanguageId:
   *                          type: number
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
  getAllIngredients: async (req, res, next) => {
    try {
      let response = await masterService.getAllIngredients(req);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/master/culinaryTechniques:
   *   get:
   *     tags: ['Master Service']
   *     security: []
   *     summary: Get all culinary techniques.
   *     responses:
   *       200:
   *         description: Culinary techniques fetched successfully.
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
   *                       culinaryTechniqueTitle:
   *                         type: string
   *                       easyOrdering:
   *                         type: string
   *                       categoryId:
   *                         type: number
   *                       tagId:
   *                         type: number
   *                       kitchenRequirements:
   *                         type: string
   *                       video:
   *                         type: string
   *                       spotlightVideo:
   *                         type: string
   *                       status:
   *                         type: boolean
   *                       systemLanguageId:
   *                          type: number
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
  getAllICulinaryTechniques: async (req, res, next) => {
    try {
      let response = await masterService.getAllICulinaryTechniques(req);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/master/lessonFilters:
   *   get:
   *     tags: ['Master Service']
   *     security: []
   *     summary: Get all filter list.
   *     responses:
   *       200:
   *         description: Filters List fetched successfully.
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
   *                    grades:
   *                      type: array
   *                      items:
   *                        type: object
   *                        properties:
   *                         id:
   *                          type: number
   *                         grade:
   *                          type: string
   *                    standards:
   *                      type: array
   *                      items:
   *                        type: object
   *                        properties:
   *                         id:
   *                          type: number
   *                         standardTitle:
   *                          type: string
   *                         description:
   *                          type: string
   *                         image:
   *                          type: string
   *                         status:
   *                          type: boolean
   *                         subjectId:
   *                          type: number
   *                         systemLanguageId:
   *                          type: number
   *                    languages:
   *                      type: array
   *                      items:
   *                        type: object
   *                        properties:
   *                         id:
   *                          type: number
   *                         language:
   *                          type: string
   *                         status:
   *                          type: boolean
   *                    countries:
   *                      type: array
   *                      items:
   *                        type: object
   *                        properties:
   *                         id:
   *                          type: number
   *                         countryName:
   *                          type: string
   *                         status:
   *                          type: boolean
   *                         systemLanguageId:
   *                          type: number
   *                    ingredients:
   *                      type: array
   *                      items:
   *                        type: object
   *                        properties:
   *                         id:
   *                          type: number
   *                         ingredientTitle:
   *                          type: string
   *                         easyOrdering:
   *                          type: string
   *                         size:
   *                          type: number
   *                         scientificName:
   *                          type: string
   *                         commonName:
   *                          type: string
   *                         spotlightVideo:
   *                          type: string
   *                         seasonId:
   *                          type: number
   *                         status:
   *                          type: boolean
   *                         systemLanguageId:
   *                          type: number
   *                    culineryTechniques:
   *                      type: array
   *                      items:
   *                        type: object
   *                        properties:
   *                         id:
   *                          type: number
   *                         culinaryTechniqueTitle:
   *                          type: string
   *                         easyOrdering:
   *                          type: string
   *                         categoryId:
   *                          type: number
   *                         tagId:
   *                          type: number
   *                         kitchenRequirements:
   *                          type: string
   *                         video:
   *                          type: string
   *                         spotlightVideo:
   *                          type: string
   *                         status:
   *                          type: boolean
   *                         systemLanguageId:
   *                          type: number
   *                    cookingDuration:
   *                      type: array
   *                      items:
   *                        type: object
   *                        properties:
   *                         id:
   *                          type: number
   *                         range:
   *                          type: string
   *                         from:
   *                          type: number
   *                         to:
   *                          type: number
   *                    nutrients:
   *                      type: array
   *                      items:
   *                        type: object
   *                        properties:
   *                         id:
   *                          type: number
   *                         nutrientTitle:
   *                          type: string
   *                         categoryId:
   *                          type: number
   *                         typeId:
   *                          type: number
   *                         description:
   *                          type: string
   *                         status:
   *                          type: boolean
   *                         spotlightVideo:
   *                          type: string
   *                         systemLanguageId:
   *                          type: number
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
  getAllFiltersList: async (req, res, next) => {
    try {
      let response = await masterService.getAllFiltersList(req);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
};
