"use strict";

let studentStatsService = require("../service/studentStatsService");

module.exports = {
  /**
   * @swagger
   * /api/v1/student/dashboardStats:
   *   get:
   *     tags: ['Student Stats']
   *     summary: Get dashboard flags for student.
   *     responses:
   *       200:
   *         description: Dashboard flages fetched successfully.
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
   *                  type: object
   *                  properties:
   *                    displayNewStampAlert:
   *                      type: string
   *       400:
   *         description: User not a student
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
  dashboardStats: async (req, res, next) => {
    try {
      let { id, isStudent } = req.user;
      let response = await studentStatsService.dashboardStats(req, id, isStudent);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student/lesson/progress:
   *   post:
   *     tags: ['Student Stats']
   *     summary: Start student lesson progress.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               assignLessonId:
   *                 type: number
   *               startedAt:
   *                 type: string
   *     responses:
   *       200:
   *         description: Lesson progress saved successfully.
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
   *                  type: object
   *                  properties:
   *                    id:
   *                      type: number
   *                    assignLessonId:
   *                      type: number
   *                    startedAt:
   *                      type: string
   *                    studentId:
   *                      type: number
   *       400:
   *         description: Lesson already started!
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
  createLessonProgress: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const { id } = req.user;
      let response = await studentStatsService.createLessonProgress(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student/lesson/progress:
   *   get:
   *     tags: ['Student Stats']
   *     summary: Get student lesson progress.
   *     parameters:
   *     - in: param
   *       name: assignLessonId
   *       schema:
   *        type: number
   *     responses:
   *       200:
   *         description: Lesson progress fetched successfully.
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
   *                  type: object
   *                  properties:
   *                    id:
   *                      type: number
   *                    assignLessonId:
   *                      type: number
   *                    startedAt:
   *                      type: string
   *                    studentId:
   *                      type: number
   *                    currentScreen:
   *                      type: string
   *                    endedAt:
   *                      type: string
   *       400:
   *         description: Lesson progress does not exist
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
  getLessonProgress: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.assignLessonId;
      let response = await studentStatsService.getLessonProgress(req, id, param_id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student/lesson/progress:
   *   put:
   *     tags: ['Student Stats']
   *     summary: Update student lesson progress.
   *     parameters:
   *     - in: param
   *       name: assignLessonId
   *       schema:
   *        type: number
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               currentScreen:
   *                 type: number
   *               timeTaken:
   *                 type: number
   *               completedStep:
   *                 type: string
   *               endedAt:
   *                 type: string
   *     responses:
   *       200:
   *         description: Lesson progress updated successfully.
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
   *                  type: object
   *                  properties:
   *                   currentScreen:
   *                     type: number
   *                   timeTaken:
   *                     type: number
   *                   completedStep:
   *                     type: string
   *                   endedAt:
   *                     type: string
   *                  percentCompleted:
   *                     type: number
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
  updateLessonProgress: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.assignLessonId;
      const reqBody = req.body;
      let response = await studentStatsService.updateLessonProgress(reqBody, id, param_id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student/lesson/answer:
   *   post:
   *     tags: ['Student Stats']
   *     summary: Add student lesson answer.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               assignLessonId:
   *                 type: number
   *               questionId:
   *                 type: number
   *               answerTypeId:
   *                 type: number
   *               answerIds:
   *                  type: array
   *                  items:
   *                   type: number
   *               essay:
   *                 type: string
   *               isCorrect:
   *                 type: boolean
   *               isActivityAction:
   *                 type: boolean
   *               pointsEarned:
   *                 type: number
   *     responses:
   *       200:
   *         description: Saved successfully.
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
   *                  type: object
   *                  properties:
   *                    id:
   *                     type: number
   *                    assignLessonId:
   *                     type: number
   *                    questionId:
   *                     type: number
   *                    answerTypeId:
   *                     type: number
   *                    answerIds:
   *                     type: array
   *                     items:
   *                      type: number
   *                    essay:
   *                     type: string
   *                    isCorrect:
   *                     type: boolean
   *                    isActivityAction:
   *                     type: boolean
   *                    pointsEarned:
   *                     type: number
   *                    studentId:
   *                     type: number
   *       400:
   *         description: You have already responded!
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
  createLessonAnswer: async (req, res, next) => {
    try {
      const { id } = req.user;
      const reqBody = req.body;
      let response = await studentStatsService.createLessonAnswer(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student/lesson/answer:
   *   get:
   *     tags: ['Student Stats']
   *     summary: Get student lesson answers.
   *     parameters:
   *     - in: param
   *       name: assignLessonId
   *       schema:
   *        type: number
   *     - in: query
   *       name: question_id
   *       schema:
   *        type: number
   *     responses:
   *       200:
   *         description: Saved successfully.
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
   *                  type: array
   *                  items:
   *                   type: object
   *                   properties:
   *                    id:
   *                     type: number
   *                    assignLessonId:
   *                     type: number
   *                    questionId:
   *                     type: number
   *                    answerTypeId:
   *                     type: number
   *                    answerIds:
   *                     type: array
   *                     items:
   *                      type: number
   *                    essay:
   *                     type: string
   *                    isCorrect:
   *                     type: boolean
   *                    isActivityAction:
   *                     type: boolean
   *                    pointsEarned:
   *                     type: number
   *                    studentId:
   *                     type: number
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
  getLessonAnswer: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.assignLessonId;
      let response = await studentStatsService.getLessonAnswer(req, id, param_id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student/lesson/rating:
   *   post:
   *     tags: ['Student Stats']
   *     summary: Add lesson ratings.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               lessonId:
   *                 type: number
   *               rating:
   *                 type: number
   *     responses:
   *       200:
   *         description: Lesson rating added successfully.
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
   *                     type: number
   *                    lessonId:
   *                     type: number
   *                    rating:
   *                     type: number
   *                    studentId:
   *                     type: number
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
  addLessonRating: async (req, res, next) => {
    try {
      let { id, isStudent } = req.user;
      const reqBody = req.body;
      let response = await studentStatsService.addLessonRating(reqBody, id, isStudent);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student/process/stampsearned:
   *   get:
   *     tags: ['Student Stats']
   *     summary: Process stamps earned
   *     responses:
   *       200:
   *         description: Newly earned stamps fetched successfully.
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
   *                  type: array
   *                  items:
   *                   type: object
   *                   properties:
   *                    id:
   *                     type: number
   *                    stampTitle:
   *                     type: string
   *                    stampType:
   *                     type: string
   *                    countryId:
   *                     type: number
   *                    levelTypeId:
   *                     type: number
   *                    learningTypeId:
   *                     type: number
   *                    status:
   *                     type: boolean
   *                    systemLanguageId:
   *                     type: number
   *                    images:
   *                     type: array
   *                     items:
   *                      type: object
   *                      properties:
   *                        id:
   *                         type: number
   *                        image:
   *                         type: string
   *                        transactionId:
   *                         type: number
   *                        moduleId:
   *                         type: number
   *                        status:
   *                         type: boolean
   *                        transaction_id:
   *                         type: number
   *       400:
   *         description: User not a student.
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
  processStampsEarned: async (req, res, next) => {
    try {
      let { id, isStudent } = req.user;
      let response = await studentStatsService.processStampsEarned(req, id, isStudent);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student/passport:
   *   get:
   *     tags: ['Student Stats']
   *     summary: Get student passport
   *     responses:
   *       200:
   *         description: Student stamps fetched successfully.
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
   *                  type: object
   *                  properties:
   *                   countryStamps:
   *                    type: array
   *                    items:
   *                     type: object
   *                     properties:
   *                      id:
   *                       type: number
   *                      stampTitle:
   *                       type: string
   *                      stampType:
   *                       type: string
   *                      countryId:
   *                       type: number
   *                      levelTypeId:
   *                       type: number
   *                      learningTypeId:
   *                       type: number
   *                      status:
   *                       type: boolean
   *                      isEarned:
   *                       type: boolean
   *                      systemLanguageId:
   *                       type: number
   *                      images:
   *                       type: array
   *                       items:
   *                        type: object
   *                        properties:
   *                          id:
   *                           type: number
   *                          image:
   *                           type: string
   *                          transactionId:
   *                           type: number
   *                          moduleId:
   *                           type: number
   *                          status:
   *                           type: boolean
   *                          transaction_id:
   *                           type: number
   *                   levelStamps:
   *                    type: array
   *                    items:
   *                      type: object
   *                      properties:
   *                   learningStamps:
   *                    type: array
   *                    items:
   *                      type: object
   *                      properties:
   *       400:
   *         description: User not a student.
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
  getPassport: async (req, res, next) => {
    try {
      let { id, isStudent } = req.user;
      let response = await studentStatsService.getPassport(req, id, isStudent);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student/achievement:
   *   get:
   *     tags: ['Student Stats']
   *     summary: Get student achievement
   *     responses:
   *       200:
   *         description: Student achievements fetched successfully.
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
   *                  type: object
   *                  properties:
   *                   currentLevel:
   *                    type: object
   *                    properties:
   *                     title:
   *                      type: string
   *                   stampsEarned:
   *                    type: number
   *                   totalPoints:
   *                    type: number
   *                   countriesVisited:
   *                    type: number
   *       400:
   *         description: User not a student.
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
  getAchievements: async (req, res, next) => {
    try {
      let { id, isStudent } = req.user;
      let response = await studentStatsService.getAchievements(req, id, isStudent);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student/item:
   *   post:
   *     tags: ['Student Stats']
   *     summary: Add item to locker.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               itemId:
   *                 type: number
   *     responses:
   *       200:
   *         description: Item added successfully.
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
   *                     type: number
   *                    itemId:
   *                     type: number
   *                    studentId:
   *                     type: number
   *       400:
   *         description: User not a student / You have already selected item for this stamp.
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
  addItemEarned: async (req, res, next) => {
    try {
      let { id, isStudent } = req.user;
      let reqBody = req.body;
      let response = await studentStatsService.addItemEarned(reqBody, id, isStudent);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student/item:
   *   get:
   *     tags: ['Student Stats']
   *     summary: Get locker items.
   *     responses:
   *       200:
   *         description: Locker items fetched successfully.
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
   *                  type: array
   *                  items:
   *                   type: object
   *                   properties:
   *                    id:
   *                     type: number
   *                    itemTitle:
   *                     type: string
   *                    stampId:
   *                     type: number
   *                    image:
   *                     type: string
   *                    status:
   *                     type: boolean
   *       400:
   *         description: User not a student.
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
  getLockerItems: async (req, res, next) => {
    try {
      let { id, isStudent } = req.user;
      let response = await studentStatsService.getLockerItems(req, id, isStudent);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student/lesson/report:
   *   get:
   *     tags: ['Student Stats']
   *     summary: Get student lesson report
   *     parameters:
   *     - in: param
   *       name: id
   *       schema:
   *        type: number
   *     responses:
   *       200:
   *         description: Report fetched successfully.
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
   *                    startedAt:
   *                     type: string
   *                    endedAt:
   *                     type: string
   *                    currentScreen:
   *                     type: string
   *                    steps:
   *                     type: array
   *                     items:
   *                      type: string
   *                    questionsAnswered:
   *                     type: array
   *                     items:
   *                      type: object
   *                      properties:
   *                       question:
   *                        type: string
   *                       isEssayQuestion:
   *                        type: boolean
   *                       studentAnswer:
   *                        type: string
   *                       isCorrect:
   *                        type: boolean
   *                    skill:
   *                     type: string
   *       400:
   *         description: User not a student / report does not exist.
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
  getLessonReport: async (req, res, next) => {
    try {
      let { id, isStudent } = req.user;
      let param_id = req.params.id;
      let response = await studentStatsService.getLessonReport(req, id, param_id, isStudent);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student/healthhygiene:
   *   post:
   *     tags: ['Student Stats']
   *     summary: Add health hygiene for today.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               healthHygieneId:
   *                 type: number
   *               answer:
   *                 type: number
   *     responses:
   *       200:
   *         description: Today's answer added successfully.
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
   *                     type: number
   *                    healthHygieneId:
   *                     type: number
   *                    answer:
   *                     type: number
   *                    studentId:
   *                     type: number
   *       400:
   *         description: User not a student / You have already answered for today.
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
  addHealthHygiene: async (req, res, next) => {
    try {
      let { id, isStudent } = req.user;
      const reqBody = req.body;
      let response = await studentStatsService.addHealthHygiene(reqBody, id, isStudent);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student/healthhygiene:
   *   get:
   *     tags: ['Student Stats']
   *     summary: Get health hygiene for today.
   *     parameters:
   *     - in: param
   *       name: id
   *       schema:
   *        type: number
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               healthHygieneId:
   *                 type: number
   *               answer:
   *                 type: number
   *     responses:
   *       200:
   *         description: Today's answer added successfully.
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
   *                     type: number
   *                    studentId:
   *                     type: number
   *                    healthHygieneId:
   *                     type: number
   *                    answer:
   *                     type: number
   *       400:
   *         description: User not a student.
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
   *       404:
   *         description: Not found.
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
  getHealthHygiene: async (req, res, next) => {
    try {
      let { id, isStudent } = req.user;
      const param_id = req.params.id;
      let response = await studentStatsService.getHealthHygiene(req, id, param_id, isStudent);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
};
