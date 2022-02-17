'use strict';

const {getRandomInt} = require(`.`);

const getRandomSubarray = (items) => {
  const newItems = items.slice();
  const result = [];
  let count = getRandomInt(1, newItems.length - 1);

  while (count--) {
    result.push(...newItems.splice(
        getRandomInt(0, newItems.length - 1),
        1
    ));
  }

  return result;
};

module.exports = {
  getRandomSubarray,
};
