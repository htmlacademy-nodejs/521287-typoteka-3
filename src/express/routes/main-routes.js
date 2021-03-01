'use strict';

const {Router} = require(`express`);

const api = require(`~/express/api`).getAPI();

const ROOT = `main`;

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const [
    articles,
    categories,
  ] = await Promise.all([
    api.getArticles(),
    api.getCategories(true)
  ]);

  res.render(`${ROOT}/main`, {articles, categories});
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

mainRouter.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories();

  return res.render(`${ROOT}/categories`, {categories});
});

mainRouter.get(`/register`, (req, res) => res.render(`${ROOT}/register`));
mainRouter.get(`/login`, (req, res) => res.render(`${ROOT}/login`));

module.exports = mainRouter;
