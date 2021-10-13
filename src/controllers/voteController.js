"use strict";

const voteService = require("../service/voteService");

module.exports = {
  getVotes: async (req, res, next) => {
    let id = req.user.id;
    let discussionId = req.params.id

    const response = await voteService.getVotes(id,discussionId);
    res.status(response.status).send(response);
  },

  addVote: async (req, res, next) => {
    const response = await voteService.addVote(req.body, req.user);
    res.status(response.status).send(response);
  },
};
