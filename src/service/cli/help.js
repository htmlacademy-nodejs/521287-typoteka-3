'use strict';

const chalk = require(`chalk`);

module.exports = {
  name: `--help`,
  run() {
    const text = `Программа запускает ХТТП-сервер и формирует файл с данными для АПИ.

Инструкция:
  server <command>

Команды:
  --version           выводит номер версии
  --help              печатает этот текст
  --generate <count>  формирует файл mocks.json
  --fill <count>      формирует файл fill-db.sql
  --fill-db <count>   наполняет базу данных рыбой
  --server <port>     запускает ХТТП-сервер
    `;

    console.info(chalk.gray(text));
  }
};
