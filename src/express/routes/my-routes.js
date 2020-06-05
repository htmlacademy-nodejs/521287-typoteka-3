'use strict';

const {Router} = require(`express`);

const ROOT = `/my`;
const myRouter = new Router();

myRouter.get(`/`, (req, res) => res.send(ROOT));
myRouter.get(`/comments`, (req, res) => res.send(`${ROOT}/comments`));

module.exports = myRouter;
