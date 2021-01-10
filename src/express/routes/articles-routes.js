'use strict';

const {Router} = require(`express`);

const HttpCode = require(`../../constants`);
const api = require(`../api`).getAPI();

const ROOT = `articles`;

const articlesRouter = new Router();

articlesRouter.get(`/add`, (req, res) => res.render(`${ROOT}/new-post`));

articlesRouter.get(`/:id`, (req, res) => {
  const {id} = res.req.params;

  res.render(`${ROOT}/post`, {id});
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;

  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(),
    ]);

    res.render(`${ROOT}/edit`, {article, categories});
  } catch (error) {
    return res.render(`errors/404`).status(HttpCode.NOT_FOUND);
  }

  return null;
});

articlesRouter.get(`/category/:id`, (req, res) => {
  const {id} = res.req.params;

  res.render(`${ROOT}/articles-by-category`, {id});
});

module.exports = articlesRouter;
