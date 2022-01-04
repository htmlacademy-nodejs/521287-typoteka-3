'use strict';

const {Router} = require(`express`);

const {checkAuth} = require(`~/express/middlewares`);
const api = require(`~/express/api`).getAPI();

const ROOT = `my`;

const myRouter = new Router();

myRouter.get(`/`, checkAuth, async (req, res) => {
  const {user} = req.session;
  const userId = user.id;

  const articles = await api.getArticles({userId});

  res.render(`${ROOT}/my`, {user, articles});
});

myRouter.get(`/comments`, checkAuth, async (req, res) => {
  const {user} = req.session;
  const userId = user.id;

  const articles = await api.getArticles({userId, withComments: true});

  res.render(`${ROOT}/comments`, {user, articles});
});

module.exports = myRouter;
