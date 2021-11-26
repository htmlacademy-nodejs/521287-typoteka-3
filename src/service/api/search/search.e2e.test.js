'use strict';

const express = require(`express`);
const request = require(`supertest`);

const {HttpCode} = require(`~/constants`);
const DataService = require(`~/service/data-service/search`);

const {mockData} = require(`./mockData`);
const search = require(`./search`);

const app = express();
app.use(express.json());
search(app, new DataService(mockData));

describe(`GET /search`, () => {
  console.log(`i am in test`);
  describe(`+`, () => {
    let response;

    beforeAll(async () => {
      console.log(`before request`);
      response = await request(app).get(`/search`).query({
        query: `смартфон`,
      });
      console.log(`after request`);
      console.log(response);
    });

    it(`responds with 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`returns list of 1 found article`, () => {
      expect(response.body.length).toBe(1);
    });

    it(`returns right data`, () => {
      const foundArticleId = mockData[1].id;

      expect(response.body[0].id).toBe(foundArticleId);
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
