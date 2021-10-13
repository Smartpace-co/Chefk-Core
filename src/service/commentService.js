"use strict";

const Comment = require("../models").comments;
const utils = require("../helpers/utils");
const { StatusCodes } = require("http-status-codes");
const DiscussionForum = require("../models").discussion_forums;
const School = require("../models").schools;
const DistrictAdmin = require("../models").district_admins;
const Teacher = require("../models").teachers;

module.exports = {
  createComment: async (reqBody, reqUser) => {
    try {
      reqBody.createdBy = reqUser.id;
      reqBody.deletedAt = new Date();
      let savedComment = await Comment.create(reqBody);
      return utils.responseGenerator(
        StatusCodes.OK,
        "Created Comment Successfully",
        savedComment
      );
    } catch (err) {
      console.log(err);
    }
  },

  getAllComment: async () => {
    try {
      let getComments = await Comment.findAll({
        include: [
          {
            model: DiscussionForum,
            attributes: ["id", "topic", "description"],
          },
        ],
       
      });

      return utils.responseGenerator(
        StatusCodes.OK,
        "All comments",
        getComments
      );
    } catch (err) {
      console.log(err);
      next(err);
    }
  },

  getCommentById: async (id) => {
    try {
      let getCommentByTopic = await Comment.findAll({
        where: {
          discussionId: id,
          deletedBy: null,
        },
        include: [
          {
            model: DiscussionForum,
            attributes: ["id", "topic", "description"],
          },
          {
            model: School,
            attributes: ["id", "admin_account_name"],
            required: false,
          },
          {
            model: DistrictAdmin,
            attributes: ["id", "admin_account_name"],
            required: false,
          },
          {
            model: Teacher,
            attributes: ["id", "first_name","last_name"],
            required: false,
          },
        ],
        order: [
          ['id', 'DESC'],
      ],
      });

      return utils.responseGenerator(
        StatusCodes.OK,
        "Fetched Comment By Discussion Forum Topic",
        getCommentByTopic
      );
    } catch (err) {
      console.log(err);
    }
  },

  updateCommentStatus: async (id, reqBody, reqUser) => {
    try {
      let details = await Comment.findOne({
        where: {
          id: id,
        },
      });
      if (!details) {
        return utils.responseGenerator(
          StatusCodes.NOT_FOUND,
          "Comment Not Present"
        );
      } else {
        reqBody.deletedBy = reqUser.id;
        reqBody.deletedAt = new Date();

        let updateCommentStatus = await Comment.update(reqBody, {
          where: {
            id: id,
          },
        });
        return utils.responseGenerator(
          StatusCodes.OK,
          "Updated Comment Status",
          updateCommentStatus
        );
      }
    } catch (err) {}
  },
};
