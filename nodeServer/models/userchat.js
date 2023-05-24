'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userchat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({usertoken}) {
      // define association here
      this.hasOne(usertoken,{foreignKey: 'userId'})
    }
  }
  userchat.init({
    fname: {
      type:DataTypes.STRING,
      allowNull:false  
    },
    lname: {
      type:DataTypes.STRING,
      allowNull:false  
    },
    email: {
      type:DataTypes.STRING,
      allowNull:false  
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false  
    },
    status:{
      type:DataTypes.STRING,
      allowNull:false  
    }
  }, {
    sequelize,
    modelName: 'userchat',
  });
  return userchat;
};