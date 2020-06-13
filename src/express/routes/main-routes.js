"use strict";

const {Router} = require(`express`);

const ROOT = `main`;

const mainRouter = new Router();

mainRouter.get(`/`, (req, res) => res.render(`${ROOT}/main`));
mainRouter.get(`/register`, (req, res) => res.send(`/register`));
mainRouter.get(`/login`, (req, res) => res.send(`/login`));
mainRouter.get(`/search`, (req, res) => res.send(`/search`));
mainRouter.get(`/categories`, (req, res) => res.send(`/categories`));

module.exports = mainRouter;
