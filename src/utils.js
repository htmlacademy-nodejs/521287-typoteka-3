'use strict';

const {DateRestrict} = require(`./constants`);

const getRandomInt = (minimum, maximum) => {
  const min = Math.ceil(minimum);
  const max = Math.floor(maximum);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [
      someArray[randomPosition],
      someArray[i],
    ];
  }

  return someArray;
};

const getDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const monthI =
    date.getMonth() + 1 - getRandomInt(DateRestrict.MIN, DateRestrict.MAX - 1);
  const month = (monthI < 10 && `0`) + monthI;
  const dayI = date.getDate();
  const day = (dayI < 10 && `0`) + dayI;
  const hoursI = date.getHours();
  const hours = (hoursI < 10 && `0`) + hoursI;
  const minutesI = date.getMinutes();
  const minutes = (minutesI < 10 && `0`) + minutesI;
  const secondsI = date.getSeconds();
  const seconds = (secondsI < 10 && `0`) + secondsI;

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const sendResponse = (res, statusCode, message) => {
  const template = `
    <!DOCTYPE html>
    <html lang="ru">
      <head>
        <title>With Love from Node</title>
      </head>
      <body>
        ${message}
      </body>
    </html>
  `.trim();

  res.statusCode = statusCode;
  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset = UTF-8`,
  });

  res.end(template);
};

module.exports = {
  getRandomInt,
  shuffle,
  getDate,
  sendResponse,
};
