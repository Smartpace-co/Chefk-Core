let NotificationType = require("../models").notification_types;
let Notification = require("../models").notifications;
let utils = require("../helpers/utils");
let { StatusCodes } = require("http-status-codes");
let notificationConstant = require("../constants/notification").notification;
let Student = require("../models").students;
let User = require("../models").users;

module.exports = {
  createNotifications: async (
    entityIds,
    roleId,
    reqUserId,
    notificationKey,
    templateVars
  ) => {

    // console.log('inside notification function ==', templateVars);
    try {
      let notificationType = await NotificationType.findOne({
        where: { key: notificationKey },
      });

      let description = new Function(
        "return `" + notificationConstant[notificationKey] + "`;"
      ).call(templateVars);

      if (Array.isArray(entityIds)) {
        let notificationsEntity = entityIds.map((id) => {
          return {
            entityId: id,
            roleId,
            notificationTypeId: notificationType.id,
            description,
            createdBy: reqUserId,
          };
        });
        await Notification.bulkCreate(notificationsEntity);
      } else {
        // console.log(notificationType)
        // console.log(entityIds)
        // console.log(roleId)
        // console.log(description)
        // console.log(reqUserId)

        await Notification.create({
          entityId: entityIds,
          roleId,
          notificationTypeId: notificationType.id,
          description,
          createdBy: reqUserId,
        });
      }
      return utils.responseGenerator(
        StatusCodes.OK,
        "Notification saved successfully"
      );
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },

  getNotifications: async (entityId, roleId, pageDetails) => {
    try {
      //pagging
      const { page_size, page_no = 1 } = pageDetails;
      const pagging = {};
      parseInt(page_size)
        ? (pagging.offset = parseInt(page_size) * (page_no - 1))
        : null;
      parseInt(page_size) ? (pagging.limit = parseInt(page_size)) : null;

      let notificationDetails = await Notification.findAll({
        where: {
          entityId,
          roleId,
          status: true,
        },
        include: [
          {
            model: NotificationType,
            attributes: ["title"],
            as: "notificationType",
          },
        ],
        order: [["createdAt", "DESC"]],
        ...pagging,
      });

      return utils.responseGenerator(
        StatusCodes.OK,
        "Notification fetched successfully",
        notificationDetails
      );
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },

  getNotificationCount: async (entityId, roleId) => {
    try {
      let notificationDetails = await Notification.count({
        where: {
          entityId,
          roleId,
          status: true,
          isSeen: false,
        },
      });

      return utils.responseGenerator(
        StatusCodes.OK,
        "Notification count fetched successfully",
        notificationDetails
      );
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },

  updateNotifications: async (entityId, roleId, notificationIds, reqUser) => {
    try {
      // console.log(notificationIds)
      let notificationDetails = await Notification.update(
        { isSeen: true, updatedBy: reqUser.id },
        {
          where: {
            id: notificationIds,
          },
        }
      );

      return utils.responseGenerator(
        StatusCodes.OK,
        "Notification updated successfully",
        notificationDetails
      );
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },

};


