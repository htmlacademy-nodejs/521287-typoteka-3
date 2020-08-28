'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = service.findAll();

    return res.status(HttpCode.OK).json(articles);
  });
};
