'use strict';

const {DateRestrict} = require(`~/constants`);

const {getRandomInt} = require(`.`);

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

module.exports = {
  getDate
};
