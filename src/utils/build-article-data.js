'use strict';

const {
  getCategoriesFromBody,
} = require(`./get-categories-from-body`);

const buildArticleData = (req) => {
  const {body, file, session} = req;
  const {user} = session;

  const {
    title,
    announce,
    description,
    createdAt,
  } = body;
  const userId = user.id;
  const categories = getCategoriesFromBody(body);
  const picture = file ? file.filename : (body.picture || ``);

  return {
    userId,
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
