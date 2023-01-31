let Class = require("../models/").classes;
let CleverClassMap = require("../models/").clever_class_map;


module.exports = {
  getClassByCleverId: async (cleverId)=> {
    const data = await CleverClassMap.findOne({
      where: { clever_id: cleverId },
    });

    if(!data){
      return null;
    }

    const classSaved = await Class.findOne({
      where: { id: data.class_id },
    })
    return classSaved.dataValues;
  }
};
