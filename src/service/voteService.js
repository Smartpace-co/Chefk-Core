"use strict";

const Vote = require("../models").votes;
const DiscussionForum = require("../models").discussion_forums;

const { StatusCodes } = require("http-status-codes");
const utils = require("../helpers/utils");

module.exports = {
  getVotes: async (id,discussionId) => {
    try {
      const voteDetails = await Vote.findOne({
        where: {
          userId: id,
          discussionId:discussionId
        },
      });
      if (voteDetails) {
        return utils.responseGenerator(
          StatusCodes.OK,
          "Votes fetched successfully",
          voteDetails
        );
      } else {
        return utils.responseGenerator(
          StatusCodes.NOT_FOUND,
          "Votes details not found"
        );
      }
    } catch (err) {
      console.log(err);
    }
  },

  addVote: async (reqBody, reqUser) => {
    reqBody.createdBy = reqUser.id;
    reqBody.userId = reqUser.id;
    let savedVote;
    if (reqBody) {
      let voteDetails = await Vote.findOne({
        where: {
          userId: reqUser.id,
        },
      });
      if (!voteDetails) {
        savedVote = await Vote.create(reqBody);
      } else {
        savedVote = await Vote.update(reqBody, {
          where: {
            userId: reqUser.id,
          },
        });
      }
    }
    let discussionForumDetails = await DiscussionForum.findOne({
      where: {
        id: reqBody.discussionId,
      },
    });
    if (discussionForumDetails) {
      return utils.responseGenerator(
        StatusCodes.OK,
        "Vote updated successfully",
        discussionForumDetails
      );
    } else {
      return utils.responseGenerator(
        StatusCodes.NOT_FOUND,
        "Discussion forum details not found"
      );
    }
  },
};
