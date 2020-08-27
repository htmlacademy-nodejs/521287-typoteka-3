'use strict';

const {Router} = require(`express`);

const getMockData = require(`../lib/get-mock-data`);
const {
  CategoryService
} = require(`../data-service`);
const categories = require(`./categories`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  categories(app, new CategoryService(mockData));
})();

module.exports = app;
