require('dotenv').config();

const app = require('./app');
const db = require('./app/models');

const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
  app.listen(PORT);
});
