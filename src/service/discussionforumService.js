"use strict";

const DiscussionForum = require("../models").discussion_forums;
const { StatusCodes } = require("http-status-codes");
const utils = require("../helpers/utils");

module.exports = {
  createDiscussionforum: async (reqBody, reqUser) => {
    try {
      reqBody.createdBy = reqUser.id;
      let discussionForumDetails = await DiscussionForum.create(reqBody);

      return utils.responseGenerator(
        StatusCodes.OK,
        "Discussion forum created successfully",
        discussionForumDetails
      );
    } catch (err) {
      console.log(err);
    }
  },

  getAllDiscussionforum: async () => {
    try {
      let details = await DiscussionForum.findAll({
        where: {
          deletedAt: null,
        },
        order: [['id', 'desc']],
      });
      return utils.responseGenerator(
        StatusCodes.OK,
        "All discussion forum fetched successfully",
        details
      );
    } catch (err) {}
  },

  getDiscussionforumById: async (id) => {
    try {
      let DiscussionForumDetails = await DiscussionForum.findOne({
        where: {
          id: id,
        },
      });
      if (DiscussionForumDetails) {
        return utils.responseGenerator(
          StatusCodes.OK,
          "Discussion forum fetched successfully",
          DiscussionForumDetails
        );
      } else {
        return utils.responseGenerator(
          StatusCodes.NOT_FOUND,
          "Discussion forum details not found"
        );
      }
    } catch (err) {}
  },
  deleteDiscussionforum: async (discussionForumId) => {
    try {
      let DiscussionForumDetails = await DiscussionForum.findOne({
        where: {
          id: id,
        },
      });
      if (DiscussionForumDetails) {
        let deletedDiscussionForum = await DiscussionForum.destroy({
          where: {
            id: discussionForumId,
          },
        });
        return utils.responseGenerator(
          StatusCodes.OK,
          "Discussion forum deleted successfully",
          deletedDiscussionForum
        );
      } else {
        return utils.responseGenerator(
          StatusCodes.NOT_FOUND,
          "Discussion forum details not found"
        );
      }
    } catch (err) {
      next(err);
    }
  },
  updateDiscussionForum: async (id, reqBody, reqUser) => {
    try {
      reqBody.updatedBy = reqUser.id;
      let discussionForumDetails = await DiscussionForum.findOne({
        where: {
          id: id,
        },
      });

      if (discussionForumDetails) {
        await DiscussionForum.update(reqBody, {
          where: {
            id: id,
          },
        });
        return utils.responseGenerator(
          StatusCodes.OK,
          "Discussion forum updated successfully",
          discussionForumDetails
        );
      } else {
        return utils.responseGenerator(
          StatusCodes.NOT_FOUND,
          "Discussion forum not found"
        );
      }
    } catch (err) {}
  },
  updateVote: async (id, reqBody) => {
    try {
      let discussionForumDetails = await DiscussionForum.findOne({
        where: {
          id: id,
        },
      });
      if (discussionForumDetails) {
        let updateDetails = await DiscussionForum.update(reqBody, {
          where: {
            id: id,
          },
        });
        return utils.responseGenerator(
          StatusCodes.OK,
          "Discussion forum updated successfully",
          updateDetails
        );
      } else {
        return utils.responseGenerator(
          StatusCodes.NOT_FOUND,
          "Discussion forum not found"
        );
      }
    } catch (err) {}
  },
};
