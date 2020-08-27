'use strict';

const {nanoid} = require(`nanoid`);

const {DateRestrict} = require(`./constants`);

const MAX_ID_LENGTH = 6;

const generateId = () => nanoid(MAX_ID_LENGTH);

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

const generateComments = (count, comments) =>
  Array(count)
    .fill({})
    .map(() => ({
      id: generateId(),
      text: shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `),
    }));

module.exports = {
  generateId,
  getRandomInt,
  shuffle,
  getDate,
  generateComments,
};
