"use strict";

let schoolService = require("../service/schoolService");
let { StatusCodes } = require("http-status-codes");

module.exports = {
  /**
   * @swagger
   * /api/v1/checkSchoolNameConflict:
   *   post:
   *     tags: ['School']
   *     summary: Check school name conflict.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *     responses:
   *       200:
   *         description: No school name conflict.
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
   *         description: school name conflict.
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
   *                   type: strings
   *                 error :
   *                   type: string
   */
  checkSchoolNameConflict: async (req, res, next) => {
    try {
      const { name } = req.body;
      let response = await schoolService.checkSchoolNameConflict(name);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/school:
   *   post:
   *     tags: ['School']
   *     summary: Register school.
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
   *               email:
   *                 type: string
   *               phone_number:
   *                 type: string
   *               role_id:
   *                 type: integer
   *               school_address:
   *                 type: string
   *               contact_person_name:
   *                 type: string
   *               contact_person_number:
   *                 type: string
   *               contact_person_email:
   *                 type: string
   *               contact_person_address:
   *                 type: string
   *               emergency_contact_number:
   *                 type: string
   *               date:
   *                 type: date
   *               max_user:
   *                 type: integer
   *               package_id:
   *                 type: integer
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
   *                       id:
   *                          type: integer
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
   *                       district_id:
   *                          type: string
   *                       admin_account_name:
   *                         type: string
   *                       school_address:
   *                          type: string
   *                       contact_person_name:
   *                         type: string
   *                       contact_person_no:
   *                         type: string
   *                       contact_person_email:
   *                         type: string
   *                       emergency_contact_number:
   *                         type: string
   *                       date:
   *                         type: date
   *                       max_user:
   *                          type: integer
   *                       package_id:
   *                         type: integer
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
   *                 error :
   *                   type: string
   *       400:
   *         description: District doen't exist.
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
   *       409:
   *         description: School already exist.
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
  createSchool: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const { id } = req.user;
      let response = await schoolService.createSchool(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/school:
   *   get:
   *     tags: ['School']
   *     summary: Get all schools.
   *     responses:
   *       200:
   *         description: Schools fetched.
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
   *                      properties:
   *                       id:
   *                          type: integer
   *                       user_id:
   *                         type: integer
   *                       name:
   *                         type: string
   *                       district_id:
   *                          type: string
   *                       admin_account_name:
   *                         type: string
   *                       school_address:
   *                          type: string
   *                       contact_person_name:
   *                         type: string
   *                       contact_person_no:
   *                         type: string
   *                       contact_person_email:
   *                         type: string
   *                       emergency_contact_number:
   *                         type: string
   *                       date:
   *                         type: date
   *                       max_user:
   *                          type: integer
   *                       package_id:
   *                         type: integer
   *                       status:
   *                          type: boolean
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
   *                 error :
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
  getAllSchools: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await schoolService.getAllSchools(req, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/school/{id}:
   *   get:
   *     tags: ['School']
   *     summary: Get all schools.
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       type: string
   *     responses:
   *       200:
   *         description: School fetched.
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
   *                       id:
   *                          type: integer
   *                       user_id:
   *                         type: integer
   *                       name:
   *                         type: string
   *                       district_id:
   *                          type: string
   *                       admin_account_name:
   *                         type: string
   *                       school_address:
   *                          type: string
   *                       contact_person_name:
   *                         type: string
   *                       contact_person_no:
   *                         type: string
   *                       contact_person_email:
   *                         type: string
   *                       emergency_contact_number:
   *                         type: string
   *                       date:
   *                         type: date
   *                       max_user:
   *                          type: integer
   *                       package_id:
   *                         type: integer
   *                       status:
   *                          type: boolean
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
  getSchool: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      let response = await schoolService.getSchool(param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/schoolByDistId:
   *   get:
   *     tags: ['School']
   *     summary: Get schools by district id.
   *     security: []
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       schema:
   *        type: integer
   *     responses:
   *       200:
   *         description: Schools fetched.
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
   *                      properties:
   *                       id:
   *                          type: integer
   *                       user_id:
   *                         type: integer
   *                       name:
   *                         type: string
   *                       district_id:
   *                          type: string
   *                       admin_account_name:
   *                         type: string
   *                       school_address:
   *                          type: string
   *                       contact_person_name:
   *                         type: string
   *                       contact_person_no:
   *                         type: string
   *                       contact_person_email:
   *                         type: string
   *                       emergency_contact_number:
   *                         type: string
   *                       date:
   *                         type: date
   *                       max_user:
   *                          type: integer
   *                       package_id:
   *                         type: integer
   *                       status:
   *                          type: boolean
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
   getSchoolById: async (req, res, next) => {
    try {
      // const param_id = req.params.id;
      let response = await schoolService.getSchoolById(req);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/school/:id:
   *   put:
   *     tags: ['School']
   *     summary: Update school details.
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       schema:
   *        type: integer
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
   *               school_address:
   *                 type: string
   *               contact_person_name:
   *                 type: string
   *               contact_person_number:
   *                 type: string
   *               contact_person_email:
   *                 type: string
   *               contact_person_address:
   *                 type: string
   *               emergency_contact_number:
   *                 type: string
   *               date:
   *                 type: date
   *               max_user:
   *                 type: integer
   *               package_id:
   *                 type: integer
   *               status:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: School details updated successfully.
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
   *                   items: integer
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
   *                 error :
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
  updateSchool: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      const reqBody = req.body;
      let response = await schoolService.updateSchool(reqBody, param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  // createSchoolAdmin: async (req, res, next) => {
  //   try {
  //     const reqBody = req.body;
  //     let response = await schoolService.createSchoolAdmin(reqBody);
  //     res.status(response.status).send(response);
  //   } catch (err) {
  //     next(err);
  //   }
  // },
  getSchoolByUserId: async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      let response = await schoolService.getSchoolByUserId(param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  

  updateSchoolAdmin: async (req, res, next) => {
    try {
      const { id } = req.query.token;
      const param_id = req.query.id;
      const reqBody = req.body;
      let response = await schoolService.updateSchool(reqBody, param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  deleteSchool:async(req,res,next)=>{
    try{
            let id=req.params.id
            let response=await schoolService.deleteSchool(id,req.body,req.user)
            res.status(response.status).send(response)
    }
    catch(err){

    }
},

dashboardGraphData: async (req, res, next) => {
  try {
    const { id } = req.user;
    const param_id = req.params.id;
    let response = await schoolService.dashboardGraphData(param_id, id);
    res.status(response.status).send(response);
  } catch (err) {
    next(err);
  }
},
};
