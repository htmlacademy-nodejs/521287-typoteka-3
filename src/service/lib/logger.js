
'use strict';

const pino = require(`pino`);

const {Env} = require(`~/constants`);

const LOG_FILE = `logs/api.log`;
const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;
const defaultLogLevel = isDevMode ? `info` : `error`;
const logStream = isDevMode ? process.stdout : pino.destination(LOG_FILE);

const logger = pino({
  name: `base-logger`,
  level: process.env.LOG_LEVEL || defaultLogLevel,
  prettyPrint: isDevMode,
}, logStream);

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
