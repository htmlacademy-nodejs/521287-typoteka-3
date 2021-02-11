'use strict';

const express = require(`express`);
const request = require(`supertest`);

const {HttpCode} = require(`~/constants`);
const DataService = require(`~/service/data-service/categories`);

const {mockData, mockCategories} = require(`./mockData`);
const categories = require(`./categories`);

const app = express();
app.use(express.json());
categories(app, new DataService(mockData));

describe(`GET /categories`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  it(`responds with 200 status code`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  it(`returns list of all categories`, () => {
    const length = mockCategories.length;

    expect(response.body.length).toBe(length);
  });

  it(`returns right data`, () => {
    expect(response.body).toEqual(expect.arrayContaining(mockCategories));
  });
});
