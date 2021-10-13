"use strict";

let classReportService = require("../service/classReportService");
let { StatusCodes } = require("http-status-codes");

module.exports = {

  dashboardGraphData: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      let response = await classReportService.dashboardGraphData(param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  dashboardNeedHelp: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      let response = await classReportService.dashboardNeedHelp(param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  dashboardTimeSpent: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      let response = await classReportService.dashboardTimeSpent(param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getReportByStandard: async (req, res, next) => {
    try {
      const { id } = req.user;
      // const param_id = req.params.id;

      let response = await classReportService.getReportByStandard(req, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getReportCategories: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;

      let response = await classReportService.getReportCategories(req, param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getReportByAssignment: async (req, res, next) => {
    try {
      const { id } = req.user;
      // const param_id = req.params.id;

      let response = await classReportService.getReportByAssignment(req, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  studentReportByClass: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      let response = await classReportService.studentReportByClass(req, param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  classReportByStandard: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      let response = await classReportService.classReportByStandard(req,param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },


  getReportByAssignmentId: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      let response = await classReportService.getReportByAssignmentId(param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getStudentReport: async (req, res, next) => {
    try {
      // const { id } = req.user;
      const param_id = req.params.id;
      let response = await classReportService.getStudentReport(req, param_id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  stduentAnswerCheck: async (req, res, next) => {
    try {
      const { id } = req.user;
      const reqBody = req.body;
      let response = await classReportService.stduentAnswerCheck(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  
  studentAboveAndBelowAverageActivity: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await classReportService.studentAboveAndBelowAverageActivity(req,id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
};
