'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const {HttpCode} = require(`~/constants`);
const DataService = require(`~/service/data-service/search`);
const initDB = require(`~/service/lib/init-db`);

const {
  mockCategories,
  mockArticles,
  foundArticleTitle,
} = require(`../mockData`);
const search = require(`./search`);

const app = express();
app.use(express.json());

const mockDB = new Sequelize(`sqlite::memory:`, {
  logging: false
});

beforeAll(async () => {
  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockArticles,
  });
  search(app, new DataService(mockDB));
});

describe(`GET /search`, () => {
  describe(`+`, () => {
    let response;

    beforeAll(async () => {
      response = await request(app).get(`/search`).query({
        query: `смартфон`,
      });
    });

    it(`responds with 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`returns list of 1 found article`, () => {
      expect(response.body.length).toBe(1);
    });

    it(`returns right data`, () => {
      expect(response.body[0].title)
        .toBe(foundArticleTitle);
    });
  });

  describe(`−`, () => {
    it(`responds with 400 status code when query is empty`, async () => {
      const response = await request(app).get(`/search`);

      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    it(`responds with 404 status code when nothing is found`, async () => {
      const response = await request(app).get(`/search`).query({
        query: `бла-бла-бла`,
      });

      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});
