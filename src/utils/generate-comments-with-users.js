'use strict';

const {
  getRandomInt,
  shuffle,
} = require(`.`);

const generateCommentsWithUsers = (count, comments, users) =>
  Array(count)
    .fill({})
    .map(() => {
      const userId = getRandomInt(0, users.length - 1);
      const user = users[userId].email;
      const text = shuffle(comments)
        .slice(0, getRandomInt(1, 3))
        .join(` `);

      return ({
        user,
        text,
      });
    });

module.exports = {
  generateCommentsWithUsers,
};
