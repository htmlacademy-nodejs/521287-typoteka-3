'use strict';

const app = require(`../app`);
const {getLogger} = require(`../lib/logger`);

const DEFAULT_PORT = 3000;

const logger = getLogger({name: `api`});

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app
      .listen(port, () => {
        logger.info(`Ожидаю соединение на ${port}`);
      })
      .on(`error`, (err) => {
        logger.error(`Ошибка при создании сервера: ${err.message}`);
        process.exit(1);
      });
  },
};
