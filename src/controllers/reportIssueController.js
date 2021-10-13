"use strict"

let reportIssueService = require("../service/reportIssueService")


module.exports = {
    createReportIssue: async (req, res, next) => {
        try {
          const reqBody = req.body;
          const { id } = req.user;
          let response = await reportIssueService.createReportIssue(reqBody, id);
          res.status(response.status).send(response);
        } catch (err) {
          next(err);
        }
      },
      getReportIssueByUserId:async(req,res,next)=>{
        try{
                let id=req.params.id
                let response=await reportIssueService.getReportIssueByUserId(id)
                res.status(response.status).send(response)
        }
        catch(err)
        {
            next(err)
        }
    },
    getReportIssueById:async(req,res,next)=>{
      try{
              let id=req.params.id
              let response=await reportIssueService.getReportIssueById(id)
              res.status(response.status).send(response)
      }
      catch(err)
      {
          next(err)
      }
  },

}