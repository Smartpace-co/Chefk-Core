"use strict";

let notificationService = require("../service/notificationService");

module.exports = {
  getNotifications: async (req, res, next) => {
    try {
      let entityId = req.params.entityId;
      let roleId = req.params.roleId;
      let response = await notificationService.getNotifications(
        entityId,
        roleId,
        req.query
      );
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getNotificationCount: async (req, res, next) => {
    try {
      let entityId = req.params.entityId;
      let roleId = req.params.roleId;
      let response = await notificationService.getNotificationCount(
        entityId,
        roleId
      );
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  updateNotifications: async (req, res, next) => {
    try {
      let entityId = req.params.entityId;
      let roleId = req.params.roleId;
      let response = await notificationService.updateNotifications(
        entityId,
        roleId,
        req.body,
        req.user
      );
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
};
