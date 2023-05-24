'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usertoken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({userchat}) {
      // define association here
      this.belongsTo(userchat,{foreignKey: 'userId'})
    }
  }
  usertoken.init({
    token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'usertoken',
  });
  return usertoken;
};