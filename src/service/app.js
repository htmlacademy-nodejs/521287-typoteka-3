'use strict';

const express = require(`express`);

const {HttpCode, API_PREFIX} = require(`~/constants`);
const {getLogger} = require(`~/service/lib/logger`);
const routes = require(`~/service/api`);

const app = express();
const logger = getLogger({name: `api`});

app.use(express.json());

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);

  res.on(`finish`, () => {
    logger.info(`Response status code was ${res.statusCode}`);
  });

  return next();
});

app.use(API_PREFIX, routes);

app.use((req, res) => {
  logger.error(`Route wasn't found: ${req.url}`);

  return res.status(HttpCode.NOT_FOUND).send(`Not Found`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error's occured on processing request: ${err.message}`);

  return _res.status(HttpCode.SERVICE_UNAVAILABLE).send(`Service Unavailable`);
});

module.exports = app;
