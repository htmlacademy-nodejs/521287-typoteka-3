'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`~/constants`);
const userValidator = require(`~/service/middlewares/user-validator`);
const passwordUtils = require(`~/service/lib/password`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/users`, route);

  route.post(`/`, userValidator(service), async (req, res) => {
    const data = req.body;

    data.passwordHash = await passwordUtils.hash(data.password);
    const result = await service.create(data);
    delete result.passwordHash;

    return res.status(HttpCode.CREATED).json(result);
  });
};
