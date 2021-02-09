'use strict';

const {ExitCode} = require(`../../constants`);
const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);
const app = require(`../app`);

const DEFAULT_PORT = 3000;

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
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app
      .listen(port, () => {
        logger.info(`Ожидаю соединение на ${port}`);
      })
      .on(`error`, (error) => {
        logger.error(`Ошибка при создании сервера: ${error.message}`);
        process.exit(ExitCode.ERROR);
      });
  },
};
