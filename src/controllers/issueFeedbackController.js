"use strict";

let issueFeedbackService = require("../service/issuesFeedbackService");

module.exports = {
  getAllIssuesFeedback: async (req, res, next) => {
    try {
      let response = await issueFeedbackService.getAllIssuesFeedback();
      res.status(response.status).send(response);
      return response;
    } catch (err) {
      console.log("error");
    }
  },

  getIssuesFeedback: async (req, res, next) => {
    try {
      let id = req.params.id;
      let response = await issueFeedbackService.getIssuesFeedback(id);
      res.status(response.status).send(response);
      return response;
    } catch (err) {}
  },
  updateIssuesFeedback: async (req, res, next) => {
    try {
      let id = req.params.id;
      let response = await issueFeedbackService.updateIssuesFeedback(
        req.body,
        req.user,
        id
      );
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
};
