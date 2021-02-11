'use strict';

const {Router} = require(`express`);

const getMockData = require(`~/service/lib/get-mock-data`);
const {
  ArticleService,
  CategoryService,
  SearchService,
  CommentService,
} = require(`~/service/data-service`);

const articles = require(`./articles/articles`);
const categories = require(`./categories/categories`);
const search = require(`./search/search`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  articles(app, new ArticleService(mockData), new CommentService());
  categories(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
})();

module.exports = app;
