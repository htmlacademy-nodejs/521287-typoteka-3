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

  route.post(`/auth`, async (req, res) => {
    const {email, password} = req.body;

    const user = await service.findByEmail(email);
    if (!user) {
      const message = `Email is incorrect`;
      return res.status(HttpCode.UNAUTHORIZED).send(message);
    }

    const {passwordHash} = user;
    const isPasswordCorrect = await passwordUtils.compare(password, passwordHash);
    if (isPasswordCorrect) {
      delete user.passwordHash;
      return res.status(HttpCode.OK).json(user);
    } else {
      const message = `Password is incorrect`;
      return res.status(HttpCode.UNAUTHORIZED).send(message);
    }
  });
};
