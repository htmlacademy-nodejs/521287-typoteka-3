module.exports = {
  name: `--help`,
  run() {
    const text = `Программа запускает ХТТП-сервер и формирует файл с данными для АПИ.

Инструкция:
  server <command>

Команды:
  --version:          выводит номер версии
  --help:             печатает этот текст
  --generate <count>  формирует файл mocks.json
    `;

    console.info(text);
  }
};
