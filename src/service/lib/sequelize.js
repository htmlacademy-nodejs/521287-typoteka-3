'use strict';

const Sequelize = require(`sequelize`);

const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env;

const somethingIsNotDefined = [
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
].some((it) => it === undefined);

if (somethingIsNotDefined) {
  throw new Error(`One or more environmental variables are not defined`);
}

module.exports = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  // СУБД, с какой предстоит работать
  dialect: `postgres`,
  // Пул соединений
  pool: {
    min: 0,
    max: 5,
    idle: 10000,
    acquire: 10000,
  },
});
