"use strict";

let SubscriptionPackage = require("../models/").subscription_packages;
let SubscribePackage = require("../models/").subscribe_packages;
let Student = require("../models").students;
let Class = require("../models/").classes;

const { StatusCodes } = require("http-status-codes");
const utils = require("../helpers/utils");
let modelHelper = require("../helpers/modelHelper");
let stripeHelper = require("../helpers/stripeHelper");

module.exports = {
  getsubscribePackageById: async (id) => {
    try {
      const { entityId, roleId,entityType, isSubUser } =
      await modelHelper.entityDetails(id);
      let getsubscribePackage = await SubscribePackage.findOne({
        where: {
          id: id,
          roleId: roleId
        },
      });
      return utils.responseGenerator(
        StatusCodes.OK,
        "Fetched Subscribed Packages Successfully",
        getsubscribePackage
      );
    } catch (err) {
      console.log(err);
    }
  },
  getActiveSubscribePackage: async (id) => {
    try {
      const { entityId, roleId,entityType, isSubUser } =
      await modelHelper.entityDetails(id);
      let getActiveSubscribePackage = await SubscribePackage.findOne({
        where: {
          entityId: id,
          roleId: roleId,
          isActive: true,
        },
      });
    
      return utils.responseGenerator(
        StatusCodes.OK,
        "Fetched active subscribed package successfully",
        getActiveSubscribePackage
      );
    } catch (err) {
      console.log(err);
    }
  },
  getActiveStudentPackage: async (id,roleId) => {
    try {
      let getActiveSubscribePackage = await SubscribePackage.findOne({
        where: {
          entityId: id,
          roleId: roleId,
          isActive: true,
        },
      });
    
      return utils.responseGenerator(
        StatusCodes.OK,
        "Fetched active subscribed package successfully",
        getActiveSubscribePackage
      );
    } catch (err) {
      console.log(err);
    }
  },

  createSubscribePackage: async (reqBody, reqUser) => {
    try {
      // let deletedPayment=await Payment.destroy({
      //   where:{
      //     subscribeId:reqBody.subscribeId
      //   }
      // });
      // if(deletedPayment)
      // {
      //   await SubscribePackage.destroy({
      //     where:{
      //       id:reqBody.subscribeId
      //     }

      //    })
      // }
      const { entityId, roleId,entityType, isSubUser } =
      await modelHelper.entityDetails(reqBody.entityId);
      const subscribePackageDetails = await SubscribePackage.findAll({
        where: {
          entityId: reqBody.entityId,
          roleId: roleId,
        },
      });
      if (subscribePackageDetails) {
        await SubscribePackage.update(
          { isActive: false },
          {
            where: {
              entityId: reqBody.entityId,
              roleId: roleId
            },
          }
        );
      }
      // if (subscribePackageDetails.subscriptionId)
      //   await stripeHelper.cancelSubscription(
      //     subscribePackageDetails.subscriptionId
      //   );

      const savedSubscribePackage = await SubscribePackage.create({
        uuid: await utils.getUUID("SP"),
        entityId: reqBody.entityId,
        roleId: reqBody.roleId,
        packageId: reqBody.packageId,
      });
      return utils.responseGenerator(
        StatusCodes.OK,
        "Saved Subscribed Packages Successfully",
        savedSubscribePackage
      );
    } catch (err) {
      console.log(err);
    }
  },

  verifyMaxUserCountClass: async (id, roleId) => {
    let subscribePackageDetails = await SubscribePackage.findOne({
      where: {
        entityId: id,
        roleId: roleId,
        isActive: true,
      },
      include: [
        {
          model: SubscriptionPackage,
        },
      ],
    });

    const count = await Class.count({
      where: {
        parentId: id,
        deleted_at: null,
      },
    });
    let maxUserCount =
      subscribePackageDetails.dataValues.subscription_package.dataValues
        .maxUser;
    if (count < maxUserCount)
      return utils.responseGenerator(
        StatusCodes.OK,
        "Package verified Successfully"
      );
    else
      return utils.responseGenerator(
        StatusCodes.BAD_REQUEST,
        "You have exceeded limit. Please contact your admin"
      );
  },

  verifyMaxStudentCount: async (id, roleId) => {
    try {
      let subscribeDetails = await SubscribePackage.findOne({
        where: {
          entityId: id,
          roleId: roleId,
          isActive: true,
        },
        include: [
          {
            model: SubscriptionPackage,
          },
        ],
      });

      let studentCount = await Student.count({
        where: {
          parentId: id,
        },
      });

      let activeMxUser = subscribeDetails.toJSON().subscription_package.maxUser;
      if (studentCount < activeMxUser) {
        return utils.responseGenerator(
          StatusCodes.OK,
          "Student Count Verified"
        );
      } else {
        return utils.responseGenerator(
          StatusCodes.BAD_REQUEST,
          "you have exceeded your limit"
        );
      }
    } catch (err) {
      console.log(err);
    }
  },
};
