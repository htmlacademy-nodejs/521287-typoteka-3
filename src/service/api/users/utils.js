'use strict';

const express = require(`express`);
const Sequelize = require(`sequelize`);

const DataService = require(`~/service/data-service/users`);
const initDB = require(`~/service/lib/init-db`);

const user = require(`./users`);

const {
  mockCategories,
  mockArticles,
} = require(`../mock-data`);
const {mockUsers} = require(`./users.mocks`);

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockArticles,
    users: mockUsers,
  });

  const app = express();
  app.use(express.json());
  user(app, new DataService(mockDB));

  return app;
};

module.exports = {
  createAPI,
};
