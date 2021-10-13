"use strict";

const { StatusCodes } = require("http-status-codes");
let utils = require("../helpers/utils");
let ReportIssue = require("../models").report_issues;
let IssueFeedback = require("../models").issues_feedbacks;

module.exports = {
  async createReportIssue(reqBody, user_id) {
    try {
      reqBody.createdBy = user_id;
      const reportIssue = await ReportIssue.create(reqBody);
      const newIssuefeedback = {
        reportIssueId: reportIssue.id,
        comment: "",
        createdBy: user_id,
      };
      const issueFeedback = await IssueFeedback.create(newIssuefeedback);

      return utils.responseGenerator(
        StatusCodes.OK,
        "Report Issue created successfully",
        {
          ...reportIssue.dataValues,
          ...issueFeedback.dataValues,
        }
      );
    } catch (err) {
      throw err;
    }
  },

  getReportIssueByUserId: async (id) => {
    try {
      let getReportIssueByuserId = await ReportIssue.findAll({
        where: {
          userId: id,
        },
      });
      return utils.responseGenerator(
        StatusCodes.OK,
        "Fetched Comment By Discussion Forum Topic",
        getReportIssueByuserId
      );
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
  getReportIssueById: async (id) => {
    try {
      let getReportIssueById = await ReportIssue.findOne({
        where: {
          id: id,
        },
      });
      return utils.responseGenerator(
        StatusCodes.OK,
        "Report history fetched succesfully",
        getReportIssueById
      );
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
};
