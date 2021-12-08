'use strict';

const express = require(`express`);
const Sequelize = require(`sequelize`);

const DataService = require(`~/service/data-service/articles`);
const CommentService = require(`~/service/data-service/comments`);
const initDB = require(`~/service/lib/init-db`);

const articles = require(`./articles`);
const {
  mockCategories,
  mockArticles,
} = require(`../mockData`);

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {
    logging: false,
  });

  const app = express({limit: `50KB`});
  app.use(express.json());

  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockArticles,
  });
  articles(
      app,
      new DataService(mockDB),
      new CommentService(mockDB)
  );

  return app;
};

module.exports = {
  createAPI,
};
