"use strict";

let paymentService = require("../service/paymentService");

/**
 * @swagger
 *   tags:
 *     name: Payment
 *     description: API to manage payments.
 */

module.exports = {
  /**
   * @swagger
   * /api/v1/payment/session:
   *   post:
   *     tags: [Payment]
   *     summary: Create payment subject.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               subscribeId:
   *                 type: number
   *               customerId:
   *                 type: string
   *               priceId:
   *                 type: string
   *     responses:
   *       200:
   *         description: Session create successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *                 data:
   *                   type: string
   *       401:
   *         description: Invalid token.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       404:
   *         description: Subscription package not found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       409:
   *         description: Paymet already paid for this subscription.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       500:
   *         description: Internal server error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *                 error :
   *                   type: string
   */

  createSession: async (req, res, next) => {
    try {
      let response = await paymentService.createSession(req.body, req.user);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @swagger
   * /api/v1/payment/charge:
   *   post:
   *     tags: [Payment]
   *     summary: Charge payment.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               subscribeId:
   *                 type: number
   *               sessionId:
   *                 type: string
   *     responses:
   *       200:
   *         description: Payment charged successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       401:
   *         description: Invalid token.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *       500:
   *         description: Internal server error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status :
   *                   type: number
   *                 message :
   *                   type: string
   *                 error :
   *                   type: string
   */

  chanrgePayment: async (req, res, next) => {
    try {
      let response = await paymentService.chargePayment(req.body, req.user);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getPaymentDetails:async(req,res,next)=>{
    try{
      let id=req.params.id
        let response=await paymentService.getPaymentDetails(id)
        res.status(response.status).send(response);
    }
    catch(err){
      next(err)
    }
  }
};
