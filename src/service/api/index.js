'use strict';

const {Router} = require(`express`);

const sequelize = require(`~/service/lib/sequelize`);
const defineModels = require(`~/service/models`);
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

defineModels(sequelize);

(async () => {
  articles(app, new ArticleService(sequelize), new CommentService(sequelize));
  categories(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
})();

module.exports = app;
