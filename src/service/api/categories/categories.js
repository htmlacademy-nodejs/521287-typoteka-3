'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`~/constants`);
const {
  categoryValidator,
} = require(`~/service/middlewares`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {withCount} = req.query;

    const categories = await service.findAll({withCount});

    return res.status(HttpCode.OK).json(categories);
  });

  route.post(`/`, categoryValidator, async (req, res) => {
    const {name} = req.body;

    const createdCategory = await service.create({name});

    if (!createdCategory) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .send(`Category wasn't created`);
    }

    return res.status(HttpCode.CREATED).json(createdCategory);
  });

  route.get(`/:id`, async (req, res) => {
    const {params, query} = req;

    const {id} = params;
    const {count} = query;

    const category = await service.findOne(id, count);

    return res.status(HttpCode.OK).json(category);
  });

  route.put(`/:id`, categoryValidator, async (req, res) => {
    const {params, body} = req;

    const {id} = params;
    const category = body;

    const updatedCategory = await service.update({id, category});

    if (!updatedCategory) {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Category with ${id} wasn't found`);
    }

    return res.status(HttpCode.OK).json(updatedCategory);
  });

  route.delete(`/:id`, async (req, res) => {
    const {id} = req.params;

    const deletedCategory = await service.drop({id});

    if (!deletedCategory) {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Category with ${id} wasn't found`);
    }

    return res.status(HttpCode.OK).json(deletedCategory);
  });
};
