'use strict';

const {Router} = require(`express`);

const getMockData = require(`../lib/get-mock-data`);
const {
  CategoryService,
  SearchService,
} = require(`../data-service`);
const categories = require(`./categories`);
const search = require(`./search`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  categories(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
})();

module.exports = app;
