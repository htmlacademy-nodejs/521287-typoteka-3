'use strict';

const {
  getCategoriesFromBody,
} = require(`./getCategoriesFromBody`);

const buildArticleData = (req) => {
  const {body, file} = req;

  const {
    title,
    announce,
    description,
    createdAt,
  } = body;
  const categories = getCategoriesFromBody(body);
  const picture = file ? file.filename : (body.picture || ``);

  return {
    title,
    announce,
    description,
    createdAt,
    categories,
    picture,
  };
};

module.exports = {
  buildArticleData,
};
