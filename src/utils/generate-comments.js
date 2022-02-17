'use strict';

const {
  getRandomInt,
  shuffle,
} = require(`.`);

const generateComments = (count, articleId, userCount, comments) =>
  Array(count)
    .fill({})
    .map(() => {
      const userId = getRandomInt(1, userCount);
      const text = shuffle(comments)
        .slice(0, getRandomInt(1, 3))
        .join(` `);

      return {
        userId,
        articleId,
        text,
      };
    });

module.exports = {
  generateComments,
};
