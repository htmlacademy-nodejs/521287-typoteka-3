'use strict';

const express = require(`express`);
const request = require(`supertest`);

const {HttpCode} = require(`../../../constants`);
const {mockData} = require(`./mockData`);
const categories = require(`./categories`);
const DataService = require(`../../data-service/categories`);

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

  it(`returns list of 3 categories`, () => {
    expect(response.body.length).toBe(5);
  });

  it(`returns right data`, () => {
    expect(response.body).toEqual(
        expect.arrayContaining([
          `За жизнь`,
          `Программирование`,
          `Железо`,
          `Кино`,
          `IT`
        ])
    );
  });
});
