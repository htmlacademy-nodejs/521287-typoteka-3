'use strict';

const {HttpCode} = require(`~/constants`);

const articleKeys = [
  `title`,
  `createdDate`,
  `category`,
  `announce`,
];

const articleValidator = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keysExist = articleKeys.every((key) => keys.includes(key));

  if (!keysExist) {
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
  }

  return next();
};

module.exports = articleValidator;
