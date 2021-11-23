'use strict';

/**
 * @todo (ilyasidorchik)
 * Разбить остальные функции по файлам,
 * так как их становится много
 */

const {nanoid} = require(`nanoid`);

const {DateRestrict} = require(`~/constants`);
const {getPictureFileName} = require(`~/utils/getPictureFileName`);
const {readContent} = require(`~/utils/readContent`);
const {
  buildValidationErrorMessage,
} = require(`~/utils/buildValidationErrorMessage`);
const {
  prepareErrors,
} = require(`~/utils/prepareErrors`);

const MAX_ID_LENGTH = 6;

const generateId = () => nanoid(MAX_ID_LENGTH);

const getRandomInt = (minimum, maximum) => {
  const min = Math.ceil(minimum);
  const max = Math.floor(maximum);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomSubarray = (items) => {
  const newItems = items.slice();
  const result = [];
  let count = getRandomInt(1, newItems.length - 1);

  while (count--) {
    result.push(...newItems.splice(getRandomInt(0, newItems.length - 1), 1));
  }

  return result;
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

const getTime = (date) => {
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

  return `${hours}:${minutes}`;
};

const generateComments = (count, articleId, userCount, comments) =>
  Array(count)
    .fill({})
    .map(() => {
      const userId = getRandomInt(1, userCount);
      const text = shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `);

      return {
        userId,
        articleId,
        text,
      };
    });

const generateCommentsWithoutIds = (count, comments) =>
  Array(count)
    .fill({})
    .map(() => ({
      text: shuffle(comments)
        .slice(0, getRandomInt(1, 3))
        .join(` `),
    }));

const buildQueryString = (o) => {
  const keys = Object.keys(o);

  let queryString = `?`;

  if (keys.length === 0) {
    return queryString;
  }

  keys.forEach((key) => {
    let value = o[key];
    let arrayString = ``;
    if (Array.isArray(value)) {
      value.forEach((arrayValue) => {
        arrayString = `${arrayString}${key}=${arrayValue}&`;
      });
      queryString = `${queryString}${arrayString}`;
      return;
    }
    queryString = `${queryString}${key}=${value}&`;
  });

  return queryString.slice(0, -1);
};

module.exports = {
  generateId,
  getRandomInt,
  getRandomSubarray,
  shuffle,
  getDate,
  getTime,
  getPictureFileName,
  generateComments,
  generateCommentsWithoutIds,
  buildQueryString,
  readContent,
  buildValidationErrorMessage,
  prepareErrors,
};
