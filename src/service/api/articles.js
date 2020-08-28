'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const {articleExist} = require(`../middlewares`);

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
};
