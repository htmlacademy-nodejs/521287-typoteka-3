'use strict';

const getCategoriesFromBody = (body) => {
  const result = [];

  for (let key in body) {
    if (body[key] === `on`) {
      const categoryId = Number(key.split(`-`)[1]);

      result.push(categoryId);
    }
  }

  return result;
};

module.exports = {
  getCategoriesFromBody,
};
