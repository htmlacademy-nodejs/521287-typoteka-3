'use strict';

const express = require(`express`);
const {readFile} = require(`fs`).promises;
const chalk = require(`chalk`);

const {HttpCode, API_PREFIX} = require(`../../constants`);
const routes = require(`../api`);

const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    const app = express();

    app.use(express.json());
    app.use(API_PREFIX, routes);

    app.get(`/posts`, async (req, res) => {
      try {
        const fileContent = await readFile(FILENAME);
        const mocks = JSON.parse(fileContent);
        res.json(mocks);
      } catch (err) {
        console.error(chalk.red(`Error with "/posts" route: ${err}`));
        res.status(HttpCode.INTERNAL_SERVER_ERROR);
        res.end();
      }
    });

    app.use((req, res) => res.status(HttpCode.NOT_FOUND).send(`Not found`));

    app
      .listen(port, () => {
        console.info(chalk.green(`Ожидаю соединение на ${port}`));
      })
      .on(`error`, (err) => {
        console.error(chalk.red(`Ошибка при создании сервера: ${err}`));
      });
  },
};
