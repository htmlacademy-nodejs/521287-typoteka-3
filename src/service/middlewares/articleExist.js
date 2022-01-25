'use strict';

const {HttpCode} = require(`~/constants`);

module.exports = (service) => async (req, res, next) => {
  const {articleId, userId} = req.params;
  const {withComments = false} = req.query;

  const article = await service.findOne({id: articleId, userId, withComments});

  if (!article) {
    return res
      .status(HttpCode.NOT_FOUND)
      .send(`Article #${articleId} wasn't found`);
  }

  res.locals.article = article;

  return next();
};
