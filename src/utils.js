'use strict';

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

module.exports = {
  getRandomInt,
  shuffle,
};
