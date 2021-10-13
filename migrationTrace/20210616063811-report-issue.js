'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
      await queryInterface.createTable("report_issues",{

        id:{
          type:Sequelize.INTEGER,
          allowNull:false,
          autoIncrement:true,
          primaryKey:true
        }, 
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
        },

        description:{
          type:Sequelize.TEXT,
          allowNull:false

      },
      attachment:{
          type:Sequelize.TEXT,
          allowNull:false

      },
      createdBy: {
          type: Sequelize.INTEGER,
          field: "created_by",
         
        },
        updatedBy: {
          type: Sequelize.INTEGER,
          field: "updated_by",
         
        },
        createdAt: {
          allowNull: true,
          type: Sequelize.DATE,
          field: "created_at",
        },
        updatedAt: {
          allowNull: true,
          type: Sequelize.DATE,
          field: "updated_at",
        },

      })







  },

  down: async (queryInterface, Sequelize) => {
  
    
        await queryInterface.dropTable("report_issues")









  }
};
