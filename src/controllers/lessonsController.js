"use strict";

let lessonsService = require("../service/lessonsService");
let { StatusCodes } = require("http-status-codes");

module.exports = {

  checkNameConflict: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await lessonsService.checkNameConflict(req.body, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getAllLessons: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await lessonsService.getAllLessons(req, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getTopRatedLessons: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await lessonsService.getTopRatedLessons(req, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getSuggestedForYouLessons: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await lessonsService.getSuggestedForYouLessons(req, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getStandardList: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await lessonsService.getStandardList(req, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getStandardLessons: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await lessonsService.getStandardLessons(req, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getSearchLessons: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await lessonsService.getSearchLessons(req, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getLessonById:  async (req, res, next) => {
    try {
      const { id } = req.user;
      const param_id = req.params.id;
      let response = await lessonsService.getLessonById(req, param_id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getLessonInfoData:  async (req, res, next) => {
    try {
      const param_id = req.params.id;
      let response = await lessonsService.getLessonInfoData(param_id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  // getFilterLessons: async (req, res, next) => {
  //   try {
  //     const { id } = req.user;
  //     let response = await lessonsService.getFilterLessons(req, id);
  //     res.status(response.status).send(response);
  //   } catch (err) {
  //     next(err);
  //   }
  // },

  assignLesson: async (req, res, next) => {
    try {
      let { id } = req.user;
      const reqBody = req.body;
      let response = await lessonsService.assignLesson(reqBody, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  customSettingList: async (req, res, next) => {

    try {
      let { id } = req.user;
      let response = await lessonsService.customSettingList(id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  bookmarkLesson: async (req, res, next) => {
    try {
      let { id } = req.user;
      let param_id = req.params.id;
      const reqBody = req.body;
      let response = await lessonsService.bookmarkLesson(reqBody, param_id, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },

  getAllAssignedLessons: async (req, res, next) => {
    try {
      const { id } = req.user;
      let response = await lessonsService.getAllAssignedLessons(req, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  getAssignedRecipeTitle: async (req, res, next) => {
    try {
      const { id } = req.params;
      let response = await lessonsService.getAssignedRecipeTitle(req, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  getAssignedLesson: async (req, res, next) => {
    try {
      const { id } = req.params;
      let response = await lessonsService.getAssignedLesson(req, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  getLesson: async (req, res, next) => {
    try {
      const { id } = req.params;
      let response = await lessonsService.getLesson(req, id);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  selfAssignLesson: async (req, res, next) => {
    try {
      let { id, isStudent} = req.user;
      const reqBody = req.body;
      let response = await lessonsService.selfAssignLesson(reqBody, id, isStudent);
      res.status(response.status).send(response);
    } catch (err) {
      next(err);
    }
  },
  getAssignedLessonByRecipeId:async(req,res,next)=>{
    try{
        let id=req.params.id
        let response=await lessonsService.getAssignedLessonByRecipeId(id)
        res.status(response.status).send(response);
    }
    catch(err){
      next(err)
    }
  }
};
