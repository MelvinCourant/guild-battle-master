const Sequelize = require("sequelize");
require('dotenv').config({ path: '.env.local', override: true });

const connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DOMAIN_NAME,
  dialect: 'postgres',
});

connection
  .authenticate()
  .then(() => {
    console.log("Connexion à PostgreSQL OK.");
  })
  .catch((error) => {
    console.error("Impossible de se connecter à la base de données:", error);
  });

module.exports = connection;
