'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`~/constants`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/comments`, route);

  route.get(`/`, async (req, res) => {
    const {limit} = req.query;

    const result = await service.findAll({limit});

    return res.status(HttpCode.OK).json(result);
  });
};
