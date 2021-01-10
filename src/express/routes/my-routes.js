'use strict';

const {Router} = require(`express`);

const api = require(`../api`).getAPI();

const ROOT = `my`;

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();

  res.render(`${ROOT}/my`, {articles});
});

myRouter.get(`/comments`, (req, res) => res.render(`${ROOT}/comments`));

module.exports = myRouter;
