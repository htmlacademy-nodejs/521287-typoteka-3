'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`~/constants`);
const userValidator = require(`~/service/middlewares/user-validator`);
const passwordUtils = require(`~/service/lib/password`);

const {
  ErrorAuthMessage,
} = require(`./users.const`);

module.exports = (app, service) => {
  const route = new Router();

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
      return res
        .status(HttpCode.UNAUTHORIZED)
        .send(ErrorAuthMessage.EMAIL);
    }

    const {passwordHash} = user;
    const isPasswordCorrect = await passwordUtils.compare(password, passwordHash);

    if (isPasswordCorrect) {
      delete user.passwordHash;

      return res.status(HttpCode.OK).json(user);
    }

    return res
      .status(HttpCode.UNAUTHORIZED)
      .send(ErrorAuthMessage.PASSWORD);
  });
};
