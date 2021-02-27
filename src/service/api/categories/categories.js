'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`~/constants`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;

    const categories = await service.findAll(count);

    return res.status(HttpCode.OK).json(categories);
  });

  route.get(`/:id`, async (req, res) => {
    const {id} = req.params;
    const {count} = req.query;

    const category = await service.findOne(id, count);

    return res.status(HttpCode.OK).json(category);
  });
};
