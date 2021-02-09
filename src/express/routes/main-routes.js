"use strict";

const {Router} = require(`express`);

const api = require(`~/express/api`).getAPI();

const ROOT = `main`;

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();

  res.render(`${ROOT}/main`, {articles});
});

mainRouter.get(`/search`, async (req, res) => {
  let search = null;
  let result = [];

  try {
    search = req.query.search;

    result = await api.search(search);
  } catch (error) {
    result = [];
  }

  return res.render(`${ROOT}/search`, {search, result});
});

mainRouter.get(`/sign-up`, (req, res) => res.render(`${ROOT}/sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`${ROOT}/login`));
mainRouter.get(`/categories`, (req, res) => res.render(`${ROOT}/categories`));

module.exports = mainRouter;
