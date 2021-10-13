"use strict"

const replyService=require("../service/replyService")

module.exports={

    createReply:async(req,res,next)=>{
        try{
                let response=await replyService.createReply(req.body,req.user)
                res.status(response.status).send(response)
        }
        catch(err)
        {
            next(err)
        }
    },
    getReplyByCommentId:async(req,res,next)=>{
        try{
            let id=req.params.id
            let response=await replyService.getReplyByCommentId(id)
            res.status(response.status).send(response)
        }
        catch(err)
        {

        }
    },
    deleteReply: async (req, res, next) => {
        try {
            let id = req.params.id
            let response = await replyService.deleteReply(id,req.body,req.user)
            res.status(response.status).send(response)
        }
        catch (err) {

        }
    },
}