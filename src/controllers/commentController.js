"use strict"


const commentService=require("../service/commentService")

module.exports={

    createComment:async(req,res,next)=>{
        try{
                let response=await commentService.createComment(req.body,req.user)
                res.status(response.status).send(response)
        }
        catch(err)
        {
            next(err)
        }
    },

    getAllComment:async(req,res,next)=>{
        try{
                let response=await commentService.getAllComment()
                res.status(response.status).send(response)
        }
        catch(err){
            next(err)
        }
    },

    getCommentById:async(req,res,next)=>{
        try{
                let id=req.params.id
                let response=await commentService.getCommentById(id)
                res.status(response.status).send(response)
        }
        catch(err)
        {
            next(err)
        }
    },
    updateCommentStatus:async(req,res,next)=>{
        try{
                let id=req.params.id
                let response=await commentService.updateCommentStatus(id,req.body,req.user)
                res.status(response.status).send(response)
        }
        catch(err)
        {

        }
    }

    
}