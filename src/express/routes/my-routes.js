'use strict';

const {Router} = require(`express`);

const ROOT = `my`;

const myRouter = new Router();

myRouter.get(`/`, (req, res) => res.render(`${ROOT}/my`));
myRouter.get(`/comments`, (req, res) => res.render(`${ROOT}/comments`));

module.exports = myRouter;
