"use strict";

let journalService = require("../service/studentJournalService");
let { StatusCodes } = require("http-status-codes");

module.exports = {
  /**
   * @swagger
   * /api/v1/student/journal:
   *   post:
   *     tags: ['Student Journal']
   *     summary: Added entry to student journal.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               note:
   *                 type: string
   *     responses:
   *       200:
   *         description: Journal entry created successfully.
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
   *                       note:
   *                         type: string
   *                       studentId:
   *                         type: number
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
  createJournal: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const { id } = req.user;
      let response = await journalService.createJournal(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student/journal:
   *   get:
   *     tags: ['Student Journal']
   *     summary: Get entry of student journal.
   *     parameters:
   *     - in: query
   *       name: archive
   *       schema:
   *        type: number
   *     - in: query
   *       name: searchtext
   *       schema:
   *        type: string
   *     - in: query
   *       name: searchdate
   *       schema:
   *        type: string
   *     responses:
   *       200:
   *         description: Journal fetched successfully.
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
   *                      type: object
   *                      properties:
   *                       id:
   *                         type: string
   *                       note:
   *                         type: string
   *                       studentId:
   *                         type: number
   *                       archivedAt:
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
  getJournal: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await journalService.getJournal(req, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student/journalNotes:
   *   get:
   *     tags: ['Student Journal']
   *     summary: Get entry of student journal.
   *     parameters:
   *     - in: param
   *       name: id
   *       schema:
   *        type: number
   *     - in: query
   *       name: archive
   *       schema:
   *        type: number
   *     - in: query
   *       name: searchtext
   *       schema:
   *        type: string
   *     - in: query
   *       name: searchdate
   *       schema:
   *        type: string
   *     responses:
   *       200:
   *         description: Journal fetched successfully.
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
   *                      type: object
   *                      properties:
   *                       id:
   *                         type: string
   *                       note:
   *                         type: string
   *                       studentId:
   *                         type: number
   *                       archivedAt:
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
  getJournalNotes: async (req, res, next) => {
    try {
      const param_id = req.params.id;
      let response = await journalService.getJournal(req, param_id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student/journal:
   *   put:
   *     tags: ['Student Journal']
   *     summary: Update entry of student journal.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               notes:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                    id:
   *                     type: number
   *                    note:
   *                     type: string
   *     responses:
   *       200:
   *         description: Journal updated successfully.
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
   *                      type: object
   *                      properties:
   *                       id:
   *                         type: string
   *                       note:
   *                         type: string
   *                       studentId:
   *                         type: number
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
  updateJournal: async (req, res, next) => {
    try {
      const { id } = req.user;
      const reqBody = req.body;
      let response = await journalService.updateJournal(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student/journal/archive:
   *   put:
   *     tags: ['Student Journal']
   *     summary: Archive entry of student journal.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               ids:
   *                 type: array
   *                 items:
   *                   type: number
   *     responses:
   *       200:
   *         description: Journal entries archieved successfully.
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
  archiveJournal: async (req, res, next) => {
    try {
      const { id } = req.user;
      const reqBody = req.body;
      let response = await journalService.archiveJournal(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/student/journal/unArchive:
   *   put:
   *     tags: ['Student Journal']
   *     summary: Unarchive entry of student journal.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               ids:
   *                 type: array
   *                 items:
   *                   type: number
   *     responses:
   *       200:
   *         description: Journal entries unarchieved successfully.
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
  unArchiveJournal: async (req, res, next) => {
    try {
      const { id } = req.user;
      const reqBody = req.body;
      let response = await journalService.unArchiveJournal(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
};
