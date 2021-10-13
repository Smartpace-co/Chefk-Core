"use strict";

let accessModuleService = require("../service/accessModuleService");
let { StatusCodes } = require("http-status-codes");

module.exports = {
  /**
   * @swagger
   * /api/v1/accessmodule:
   *   get:
   *     tags: ['Access Module']
   *     summary: Get all access modules.
   *     responses:
   *       200:
   *         description: All access module fetched successfully.
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
   *                     type: object
   *                     properties:
   *                       title:
   *                         type: string
   *                       description:
   *                         type: string
   *                       id:
   *                         type: number
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
   *         description: No access module exist.
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
  getAllAccessModules: async (req, res, next) => {
    try {
      let response = await accessModuleService.getAllAccessModules(req, res);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /api/v1/accessmodule/{id}:
   *   get:
   *     tags: ['Access Module']
   *     summary: Get all access modules.
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       type: string
   *     responses:
   *       200:
   *         description: Fetched Access Modules Successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                   id:
   *                     type: number
   *                   role_id:
   *                     type: number
   *                   module_id:
   *                     type: number
   *                   createdBy:
   *                     type: number
   *                   updatedBy:
   *                     type: string
   *                     format: nullable
   *                   createdAt:
   *                     type: string
   *                   updatedAt:
   *                     type: string
   *                   access_module:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: number
   *                       title:
   *                         type: string
   *                       description:
   *                         type: string
   *                         format: nullable
   *                       createdBy:
   *                         type: number
   *                       updatedBy:
   *                         type: string
   *                         format: nullable
   *                       createdAt:
   *                         type: string
   *                       updatedAt:
   *                         type: string
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

  getAccessModulesByRoleId:async(req,res,next)=>{
    try{
      let id=req.params.id
        let response=await accessModuleService.getAccessModulesByRoleId(id)
        res.status(response.status).send(response);
    }
    catch(err)
    {
      console.log(err)
    }
  }
};
