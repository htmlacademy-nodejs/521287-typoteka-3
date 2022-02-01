'use strict';

const {
  DefaultPort,
  ExitCode,
} = require(`~/constants`);
const {getLogger} = require(`~/service/lib/logger`);
const sequelize = require(`~/service/lib/sequelize`);
const socket = require(`~/service/lib/socket`);
const app = require(`~/service/app`);

const server = socket(app);
const logger = getLogger({name: `api`});

module.exports = {
  name: `--server`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (error) {
      logger.error(`An error occured: ${error.message}`);
      process.exit(ExitCode.ERROR);
    }

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DefaultPort.SERVICE;

    server
      .listen(port, () => {
        logger.info(`Ожидаю соединение на ${port}`);
      })
      .on(`error`, (error) => {
        logger.error(`Ошибка при создании сервера: ${error.message}`);
        process.exit(ExitCode.ERROR);
      });
  },
};
