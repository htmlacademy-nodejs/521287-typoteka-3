'use strict';

const http = require(`http`);
const {readFile} = require(`fs`).promises;
const chalk = require(`chalk`);

const {HttpCode} = require(`../../constants`);
const {sendResponse} = require(`../../utils`);

const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;

const onClientConnect = async (req, res) => {
  const notFoundMessageText = `Not Found`;

  switch (req.url) {
    case `/`:
      try {
        const fileContent = await readFile(FILENAME);
        const mocks = JSON.parse(fileContent);
        const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);

        sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }

      break;

    default:
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);

      break;
  }
};

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    http.createServer(onClientConnect)
      .listen(port)
      .on(`listening`, (err) => {
        if (err) {
          console.error(`Ошибка при создании сервера: `, err);
        }

        console.info(chalk.green(`Ожидаю соединение на ${port}`));
      });
  }
};

