'use strict';

const {io} = require(`socket.io-client`);

const {
  DefaultPort,
} = require(`~/constants`);

const SERVER_URL = `http://localhost:${DefaultPort.SERVICE}`;

(() => {
  const socket = io(SERVER_URL, {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": `abcd`
    }
  });

  socket.on(`connect`, () => {
    console.log(socket.id);
  });

  socket.on(`disconnect`, () => {
    console.log(socket.id);
  });

  socket.addEventListener(`comment:create`, (comment) => {
    console.log(`comment ↓`);
    console.log(comment);
  });
})();
