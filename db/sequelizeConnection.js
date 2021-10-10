const { Sequelize, DataTypes } = require('sequelize');
const initModels = require('../models/init-models');
const sequelize = new Sequelize('lessonsdb', 'postgres', '12345678', {
  dialect: 'postgres',
  host: 'localhost'
  //logging: false,
});

module.exports = {
  ...initModels(sequelize),
  sequelize,
  DataTypes,
};
