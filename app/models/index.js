const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(`./config`)[env];
require('dotenv').config();

const db = {};

let sequelize = null;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const modelPathList = ['./dust'];

modelPathList.forEach(modelPath => {
  const model = sequelize.import(modelPath);
  db[model.name] = model;
});

module.exports = db;
