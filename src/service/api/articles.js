'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const {articleExist, articleValidator} = require(`../middlewares`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = service.findAll();

    return res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, articleExist(service), (req, res) => {
    const {article} = res.locals;

    return res.status(HttpCode.OK).json(article);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = service.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.put(`/:articleId`, articleExist(service), (req, res) => {
    const {articleId} = req.params;
    const article = service.update(articleId);

    if (!article) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .send(`Article #${articleId} isn't found`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  route.delete(`/:articleId`, articleExist(service), (req, res) => {
    const {articleId} = req.params;
    const article = service.drop(articleId);

    if (!article) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .send(`Article #${articleId} isn't found`);
    }

    return res.status(HttpCode.OK).json(article);
  });
};
