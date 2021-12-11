'use strict';

const {Router} = require(`express`);

const api = require(`~/express/api`).getAPI();

const ROOT = `my`;

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const {user} = req.session;

  const articles = await api.getArticles();

  res.render(`${ROOT}/my`, {user, articles});
});

myRouter.get(`/comments`, async (req, res) => {
  const {user} = req.session;

  const articles = await api.getArticles({comments: true});

  /**
   * Здесь должно быть получение статей пользователя,
   * но пока нет такого функционала
   */
  res.render(`${ROOT}/comments`, {user, articles: articles.slice(0, 3)});
});

module.exports = myRouter;
