'use strict';

const {
  getRandomInt,
  shuffle,
} = require(`.`);

const generateCommentsWithoutIds = (count, comments) =>
  Array(count)
    .fill({})
    .map(() => ({
      text: shuffle(comments)
        .slice(0, getRandomInt(1, 3))
        .join(` `),
    }));

module.exports = {
  generateCommentsWithoutIds,
};
