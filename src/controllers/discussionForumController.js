"use strict";

const discussionforumService = require("../service/discussionforumService");

module.exports = {
  createDiscussionforum: async (req, res, next) => {
    try {
      let response = await discussionforumService.createDiscussionforum(
        req.body,
        req.user
      );
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getAllDiscussionforum: async (req, res, next) => {
    try {
      let response = await discussionforumService.getAllDiscussionforum();
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getDiscussionforumById: async (req, res, next) => {
    try {
      let id = req.params.id;
      let response = await discussionforumService.getDiscussionforumById(id);
      res.status(response.status).send(response);
    } catch (err) {}
  },
  deleteDiscussionforum: async (req, res, next) => {
    try {
      let id = req.params.id;
      let response = await discussionforumService.deleteDiscussionforum(id);
      res.status(response.status).send(response);
    } catch (err) {}
  },
  updateDiscussionForum: async (req, res, next) => {
    try {
      let id = req.params.id;
      let response = await discussionforumService.updateDiscussionForum(
        id,
        req.body,
        req.user
      );
      res.status(response.status).send(response);
    } catch (err) {}
  },
  updateVote: async (req, res, next) => {
    try {
      let id = req.params.id;
      let response = await discussionforumService.updateVote(id, req.body);
      res.status(response.status).send(response);
    } catch (err) {}
  },
};
