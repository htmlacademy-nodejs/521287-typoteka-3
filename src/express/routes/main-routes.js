"use strict";

const {Router} = require(`express`);

const ROOT = `main`;

const mainRouter = new Router();

mainRouter.get(`/`, (req, res) => res.render(`${ROOT}/main`));
mainRouter.get(`/sign-up`, (req, res) => res.render(`${ROOT}/sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`${ROOT}/login`));
mainRouter.get(`/search`, (req, res) => res.render(`${ROOT}/search`));
mainRouter.get(`/categories`, (req, res) => res.render(`${ROOT}/categories`));

module.exports = mainRouter;
