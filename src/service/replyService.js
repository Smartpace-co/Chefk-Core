"use strict"

const Reply=require("../models").replies
const Comment=require("../models").comments
const utils=require("../helpers/utils")
const{StatusCodes}=require("http-status-codes")
const School=require("../models").schools
const DistrictAdmin = require("../models").district_admins;
const Teacher = require("../models").teachers;

module.exports={
    createReply:async(reqBody,reqUser)=>{
        try{
                reqBody.createdBy=reqUser.id
                reqBody.deletedAt=new Date();
                let createReply=await Reply.create(reqBody)
                return utils.responseGenerator(StatusCodes.OK,"Created Reply Successfully",createReply)
        }
        catch(err)
        {
            
        }
    },
    
    getReplyByCommentId:async(id)=>{
        try{
                let replyDetails=await Reply.findAll({
                    where:{
                        commentId:id,
                        deletedBy:null
                    },
                    include:[
                        {
                            model:Comment,
                            attributes:["id","comment"]
                        },
                        {
                            model:School,
                            attributes:["id","admin_account_name"]
                        }, 
                        {
                            model: DistrictAdmin,
                            attributes: ["id", "admin_account_name"],
                        },
                        {
                            model: Teacher,
                            attributes: ["id", "first_name","last_name"],
                            required: false,
                          },
                    ],
                    order: [
                        ['id', 'DESC'],
                    ],
                })
                return utils.responseGenerator(StatusCodes.OK,"Fetched Reply Successfully",replyDetails)
        }
        catch(err){

        }
    },

    deleteReply:async (id,reqBody,reqUser)=>{
        try{
            reqBody.deletedBy=reqUser.id;
            reqBody.deletedAt=new Date();
                let deletedReply=await Reply.update(reqBody,{
                    where:{
                        id:id
                    }
                })
                return utils.responseGenerator(StatusCodes.OK,"Deleted Reply Successfully",deletedReply)
    
    
        }
        catch(err)
        {
            next(err)
        }
    },
}