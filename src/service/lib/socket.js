'use strict';

const {createServer} = require(`http`);
const {Server} = require(`socket.io`);

const {
  DefaultPort,
  HttpMethod,
} = require(`~/constants`);
const {getLogger} = require(`~/service/lib/logger`);

const logger = getLogger({name: `ws`});

module.exports = (app) => {
  const server = createServer(app);

  const io = new Server(server, {
    cors: {
      origin: `http://localhost:${DefaultPort.EXPRESS}`,
      methods: [HttpMethod.GET, HttpMethod.POST],
      allowedHeaders: [`my-custom-header`],
      credentials: true,
    }
  });

  app.locals.socketio = io;

  io.on(`connection`, (socket) => {
    const {address: IP} = socket.handshake;

    logger.info(`Новое подключение: ${IP}`);

    socket.on(`disconnect`, () => {
      logger.info(`Клиент отключён: ${IP}`);
    });
  });

  return server;
};
