"use strict";

const subscribePackageService = require("../service/subscribePackageService");

module.exports = {
  getsubscribePackageById: async (req, res, next) => {
    try {
      let id = req.params.id;
      let response = await subscribePackageService.getsubscribePackageById(id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  getActiveSubscribePackage: async (req, res, next) => {
    try {
      let id = req.params.id;

      let response = await subscribePackageService.getActiveSubscribePackage(id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  getActiveStudentPackage: async (req, res, next) => {
    try {
      let id = req.params.id;
      let roleId = req.params.roleId;

      let response = await subscribePackageService.getActiveStudentPackage(id,roleId);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  createSubscribePackage: async (req, res, next) => {
    try {
      let response = await subscribePackageService.createSubscribePackage(
        req.body,
        req.user
      );
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  verifyMaxUserCountClass: async (req, res, next) => {
    try {
      let id = req.query.id;
      let roleId = req.query.roleId;
      let response = await subscribePackageService.verifyMaxUserCountClass(
        id,
        roleId
      );
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  verifyMaxStudentCount: async (req, res, next) => {
    try {
      let id = req.query.id;
      let roleId = req.query.roleId;
      let response = await subscribePackageService.verifyMaxStudentCount(
        id,
        roleId
      );
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
};
