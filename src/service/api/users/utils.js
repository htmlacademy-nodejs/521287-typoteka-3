'use strict';

const express = require(`express`);
const Sequelize = require(`sequelize`);

const DataService = require(`../../data-service/users`);
const initDB = require(`../../lib/init-db`);
const user = require(`./users`);

const {
  mockOffers,
  mockCategories,
} = require(`../offers/mockData`);
const {mockUsers} = require(`./users.mocks`);

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {
    categories: mockCategories,
    offers: mockOffers,
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
