'use strict';

const express = require(`express`);

const DataService = require(`~/service/data-service/articles`);
const CommentService = require(`~/service/data-service/comments`);

const {mockData} = require(`./mockData`);
const articles = require(`./articles`);

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));

  app.use(express.json());

  articles(app, new DataService(cloneData), new CommentService());

  return app;
};

module.exports = {
  createAPI,
};
