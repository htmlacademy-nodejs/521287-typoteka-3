'use strict';

const express = require(`express`);

const {mockData} = require(`./mockData`);
const articles = require(`./articles`);
const DataService = require(`../../data-service/articles`);
const CommentService = require(`../../data-service/comments`);

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
