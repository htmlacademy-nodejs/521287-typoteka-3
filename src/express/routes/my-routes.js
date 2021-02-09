'use strict';

const {Router} = require(`express`);

const api = require(`~/express/api`).getAPI();

const ROOT = `my`;

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();

  res.render(`${ROOT}/my`, {articles});
});

myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles();

  res.render(`${ROOT}/comments`, {articles: articles.slice(0, 3)});
});

module.exports = myRouter;
