"use strict";

let assignmentService = require("../service/assignmentService");
let { StatusCodes } = require("http-status-codes");

module.exports = {

  getAllAssignments: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await assignmentService.getAllAssignments(req, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  archiveAssignment: async (req, res, next) => {
    try {
      const { id } = req.user;
      let param_id = req.params.id;
      let response = await assignmentService.archiveAssignment(param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  unArchiveAssignment: async (req, res, next) => {
    try {
      const { id } = req.user;
      let param_id = req.params.id;
      let response = await assignmentService.unArchiveAssignment(param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getTeacherInstruction: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.lessonId;
      let response = await assignmentService.getTeacherInstruction(param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getRecipeIngredients: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.assignmentId;
      let response = await assignmentService.getRecipeIngredients(param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getSubstitueList: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      let response = await assignmentService.getSubstitueList(param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  updateAssignment: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      const reqBody = req.body;
      let response = await assignmentService.updateAssignment(reqBody, param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  deleteAssignment: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      let response = await assignmentService.deleteAssignment(param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  }

};
