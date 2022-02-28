require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];
let utils = require("../helpers/utils");
let stripeHelper = require("../helpers/stripeHelper");
let modelHelper = require("../helpers/modelHelper");
let Teacher = require("../models").teachers;
let School = require("../models").schools;
let District = require("../models").district_admins;
let SubscriptionPackage = require("../models").subscription_packages;
let SubscribePackage = require("../models").subscribe_packages;
let Payment = require("../models").payments;
let { StatusCodes } = require("http-status-codes");

module.exports = {
  createSession: async (reqBody) => {
    try {
      const { subscribeId, customerId, priceId } = reqBody;

      const subscribeDetails = await SubscribePackage.findOne({
        attributes: ["packageId", "sessionId", "subscriptionEndDate"],
        where: { id: subscribeId },
        include: [
          {
            model: SubscriptionPackage,
            // attributes: ["packageTitle", "packageFor", "price", "status"],
          },
        ],
      });

      const packageDetails = subscribeDetails.subscription_package;
      const packageAmount = Number(packageDetails.price);
      if (!packageDetails)
        return utils.responseGenerator(
          StatusCodes.NOT_FOUND,
          "Subscription package not found"
        );
      else if (!packageDetails.status)
        return utils.responseGenerator(
          StatusCodes.OK,
          "You can not pay for inactive subscription package"
        );
      else if (packageAmount === 0 || isNaN(packageAmount))
        return utils.responseGenerator(
          StatusCodes.OK,
          "You can not pay for free subscription package"
        );

      const session = await stripeHelper.createSession(
        packageDetails,
        customerId,
        subscribeId,
        priceId
      );

      if (subscribeDetails.sessionId && subscribeDetails.subscriptionEndDate) {
        await SubscribePackage.update(
          {
            sessionId: session.id,
          },
          { where: { id: subscribeId } }
        );
        return utils.responseGenerator(
          StatusCodes.OK,
          "Session created successfully",
          session.id
        );
      }

      let currentYear = new Date().getFullYear(),
        // subscriptionStartDate = new Date(),
        subscriptionEndDate = new Date(
          packageDetails.validityFrom > packageDetails.validityTo
            ? currentYear + 1
            : currentYear,
          packageDetails.validityTo,
          0
        ),
        gracePeriodStartDate = new Date(subscriptionEndDate),
        gracePeriodEndDate = new Date(subscriptionEndDate),
        subscriptionRenewalDate = new Date(
          currentYear + 1,
          packageDetails.validityFrom - 1 === 0
            ? 12
            : packageDetails.validityFrom - 1,
          0
        );
      gracePeriodStartDate.setDate(gracePeriodStartDate.getDate() + 1);
      gracePeriodEndDate.setDate(
        gracePeriodEndDate.getDate() + packageDetails.gracePeriod
      );
      subscriptionRenewalDate.setDate(subscriptionRenewalDate.getDate() + 1);

      await SubscribePackage.update(
        {
          sessionId: session.id,
          // isPaymentPaid: true,
          // subscriptionStartDate,
          subscriptionEndDate,
          gracePeriodStartDate,
          gracePeriodEndDate,
          subscriptionRenewalDate,
        },
        { where: { id: subscribeId } }
      );

      console.log("Stripe session created successfully");

      return utils.responseGenerator(
        StatusCodes.OK,
        "Session created successfully",
        session.id
      );
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },

  chargePayment: async (reqBody) => {
    try {
      const { subscribeId, sessionId } = reqBody;

      let subscribePackage = await SubscribePackage.findOne({
        attributes: ["isPaymentPaid", "packageId"],
        where: { id: subscribeId },
      });
      if (subscribePackage.isPaymentPaid)
        return utils.responseGenerator(
          StatusCodes.CONFLICT,
          "Paymet is already paid for this subscription"
        );

      let package = await SubscriptionPackage.findOne({
        // attributes: ["isPaymentPaid"],
        where: { id: subscribePackage.packageId },
      });

      let subscriptionStartDate = new Date();

      // // Get session detail
      // const session = await stripeHelper.getSession(sessionId);

      await SubscribePackage.update(
        {
          isPaymentPaid: true,
          subscriptionStartDate,
        },
        {
          where: {
            id: subscribeId,
          },
        }
      );
      // await Payment.create({
      //   isPaymentPaid: true,
      //   subscribeId,
      //   sessionId,
      //   paymentIntentId: session.payment_intent,
      // });

      return utils.responseGenerator(
        StatusCodes.OK,
        "Payment charged successfully"
      );
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },

  getPaymentDetails: async (id) => {
    /*try {
      let customerId;
      const { entityId, entityType, isSubUser } =
        await modelHelper.entityDetails(id);
      if (entityType == "teacher") {
        let teacherDetails = await Teacher.findOne({
          where: {
            id: entityId,
          },
        });
        customerId = teacherDetails.customerId;
      } else if (entityType == "school") {
        let schoolDetails = await School.findOne({
          where: {
            id: entityId,
          },
        });
        customerId = schoolDetails.customerId;
      } else if (entityType == "district") {
        let districtDetails = await District.findOne({
          where: {
            id: entityId,
          },
        });
        customerId = districtDetails.customerId;
      }

      let paymentDetails = await stripeHelper.listInvoices(customerId);

      return utils.responseGenerator(
        StatusCodes.OK,
        "fetched subscribe ids successfully",
        paymentDetails
      );
    } catch (err) {
      console.log(err);
    }*/
    try {
      const order = [];
      const orderItem = ["id"];
      const sortOrder = "desc";
      sortOrder == "desc" ? orderItem.push("DESC") : orderItem.push("ASC");
      order.push(orderItem);
      let paymentDetails = await SubscribePackage.findAll({
        where: {
          entityId: id,
        },
        include: [
          {
            model: SubscriptionPackage,
            attributes: ["id", "price"],
          },
        ],
        order: order,
      });
      return utils.responseGenerator(
        StatusCodes.OK,
        "fetched subscribe ids successfully",
        paymentDetails
      );
    } catch (err) {
      console.log(err);
      //next(err)
    }
  },
};
