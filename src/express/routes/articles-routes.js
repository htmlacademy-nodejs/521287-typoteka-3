'use strict';

const {Router} = require(`express`);

const ROOT = `/articles`;

const articlesRouter = new Router();

articlesRouter.get(`/add`, (req, res) => res.render(`articles/new-post`));

articlesRouter.get(`/:id`, (req, res) => {
  const {id} = res.req.params;

  res.render(`articles/post`, {id});
});

articlesRouter.get(`/edit/:id`, (req, res) => {
  const {id} = res.req.params;

  res.send(`${ROOT}/edit/${id}`);
});

articlesRouter.get(`/category/:id`, (req, res) => {
  const {id} = res.req.params;

  res.send(`${ROOT}/category/${id}`);
});

module.exports = articlesRouter;
