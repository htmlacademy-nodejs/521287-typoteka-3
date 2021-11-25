'use strict';

const getArticleCategoriesIds = (article) =>
  article.categories.map((item) => item.id);

module.exports = {
  getArticleCategoriesIds,
};
