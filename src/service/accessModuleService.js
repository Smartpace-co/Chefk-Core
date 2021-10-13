let AccessModule = require("../models").access_modules;
let RoleModule=require("../models").role_modules
let utils = require("../helpers/utils");
let { StatusCodes } = require("http-status-codes");

module.exports = {
   getAllAccessModules:async() =>{
    try {
      const allAccessModules = await AccessModule.findAll({
        attributes: ["title", "description", "id"],
      });
      if (allAccessModules.length === 0) {
        return utils.responseGenerator(StatusCodes.NOT_FOUND, "No access module exist");
      }
      return utils.responseGenerator(StatusCodes.OK, "All access module fetched successfully", allAccessModules);
    } catch (err) {
      throw err;
    }
  },

  getAccessModulesByRoleId:async(id)=>{
    try{
          let accesModules=await RoleModule.findAll({
            where:{
              role_id:id
            },
            include: ["access_module"]


            
          })
          return utils.responseGenerator(StatusCodes.OK,"Fetched Access Modules Successfully",accesModules)
    }
    catch(err)
    {
      console.log("error")
    }
  }
};
