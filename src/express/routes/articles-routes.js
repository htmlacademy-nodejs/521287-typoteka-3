'use strict';

const {Router} = require(`express`);

const ROOT = `articles`;

const articlesRouter = new Router();

articlesRouter.get(`/add`, (req, res) => res.render(`${ROOT}/new-post`));

articlesRouter.get(`/:id`, (req, res) => {
  const {id} = res.req.params;

  res.render(`${ROOT}/post`, {id});
});

articlesRouter.get(`/edit/:id`, (req, res) => {
  const {id} = res.req.params;

  res.render(`${ROOT}/edit-post`, {id});
});

articlesRouter.get(`/category/:id`, (req, res) => {
  const {id} = res.req.params;

  res.render(`${ROOT}/articles-by-category`, {id});
});

module.exports = articlesRouter;
