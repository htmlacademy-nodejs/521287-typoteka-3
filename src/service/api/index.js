'use strict';

const {Router} = require(`express`);

const getMockData = require(`../lib/get-mock-data`);
const {
  ArticleService,
  CategoryService,
  SearchService,
  CommentService,
} = require(`../data-service`);
const articles = require(`./articles`);
const categories = require(`./categories`);
const search = require(`./search`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  articles(app, new ArticleService(mockData), new CommentService());
  categories(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
})();

module.exports = app;
