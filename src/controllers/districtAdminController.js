"use strict";

let districtAdminService = require("../service/districtAdminService");
let { StatusCodes } = require("http-status-codes");

module.exports = {
  /**
   * @swagger
   * /api/v1/districtAdmin/registration:
   *   post:
   *     tags: ['District Admin']
   *     summary: Register districtAdmin.
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               admin_account_name:
   *                 type: string
   *               role_id:
   *                 type: integer
   *               package_id:
   *                 type: integer
   *               phone_number:
   *                 type: string
   *               email:
   *                 type: string
   *               contact_person_name:
   *                 type: string
   *               contact_person_no:
   *                 type: string
   *               contact_person_email:
   *                 type: string
   *               status:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Email send successfull.
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
   *                   type: object
   *                   properties:
   *                       is_email_verified:
   *                         type: string
   *                       is_phone_verified:
   *                         type: string
   *                       role_id:
   *                         type: integer
   *                       email:
   *                         type: string
   *                       phone_number:
   *                         type: string
   *                       status:
   *                         type: boolean
   *                       user_id:
   *                         type: integer
   *                       name:
   *                         type: string
   *                       admin_account_name:
   *                         type: string
   *                       contact_person_name:
   *                         type: string
   *                       contact_person_no:
   *                         type: string
   *                       package_id:
   *                         type: integer
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
  createDistrictAdmin: async (req, res, next) => {
    try {
      const { id } = req.user;
      const reqBody = req.body;
      let response = await districtAdminService.createDistrictAdmin(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/districtAdmin/profile/:
   *   get:
   *     tags: ['District Admin']
   *     summary: Get district admin details.
   *     responses:
   *       200:
   *         description: District admin details.
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
   *                   type: object
   *                   properties:
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
   *         description: No details found.
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
  getDistrictAdminProfile: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await districtAdminService.getDistrictAdminProfile(id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/districtAdmin/profile/:
   *   put:
   *     tags: ['District Admin']
   *     summary: Update district admin details.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                type: string
   *               phone_number:
   *                type: string
   *               status:
   *                type: boolean
   *               profile_image:
   *                type: string
   *               admin_account_name:
   *                type: string
   *               admin_address:
   *                type: string
   *               admin_gender:
   *                type: boolean
   *               name:
   *                type: string
   *               display_name:
   *                type: string
   *               district_address:
   *                type: string
   *               district_image:
   *                type: boolean
   *               district_phone_no:
   *                type: string
   *               contact_person_image:
   *                type: string
   *               contact_person_name:
   *                type: string
   *               contact_person_no:
   *                type: boolean
   *               contact_person_email:
   *                type: string
   *               contact_person_gender:
   *                type: string
   *               contact_person_title:
   *                type: string
   *     responses:
   *       200:
   *         description: Records updated.
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
   *                   type: object
   *                   properties:
   *                    user:
   *                      type: integer
   *                    district:
   *                       type: integer
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
  updateDistrictAdminProfile: async (req, res, next) => {
    try {
      const { id } = req.user;
      const reqBody = req.body;
      let response = await districtAdminService.updateDistrictAdminProfile(id, reqBody);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/districts:
   *   get:
   *     tags: ['District Admin']
   *     summary: Fetch all districts.
   *     security : []
   *     responses:
   *       200:
   *         description: Districts fetched.
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
   *                   type: array
   *                   items:
   *                      type: object
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
  getAllDistricts: async (req, res, next) => {
    try {

      let response = await districtAdminService.getAllDistricts();
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  getAllDistrictAdmins: async (req, res, next) => {
    try {
      const { id } = req.user;

      let response = await districtAdminService.getAllDistrictAdmin(id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  // createDistrict: async (req, res, next) => {
  //   try {
  //     const { id } = req.query.token;
  //     const reqBody = req.body;
  //     let response = await districtAdminService.createDistrictAdmin(reqBody, id);
  //     res.status(response.status).send(response);
  //   } catch (err) {
  //     next(err);
  //   }
  // },

  getDistrictAdmin: async (req, res, next) => {
    try {
      const id  = req.params.id;
      let response = await districtAdminService.getDistrictAdminProfile(id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  updateDistrictProfile: async (req, res, next) => {
    try {
      const  id  = req.params.id;
      const reqBody = req.body;
      let response = await districtAdminService.updateDistrictAdminProfile(id, reqBody);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  deleteDistrictAdmin: async (req, res, next) => {
    try {
        let id = req.params.id
        let response = await districtAdminService.deleteDistrictAdmin(id,req.body,req.user)
        res.status(response.status).send(response)
    }
    catch (err) {

    }
},
dashboardGraphData: async (req, res, next) => {
  try {
    const { id } = req.user;
    const param_id = req.params.id;
    let response = await districtAdminService.dashboardGraphData(param_id, id);
    res.status(response.status).send(response);
  } catch (err) {
    next(err);
  }
},
};
