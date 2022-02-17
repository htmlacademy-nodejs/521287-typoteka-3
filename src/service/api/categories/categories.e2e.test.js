'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const {HttpCode} = require(`~/constants`);
const DataService = require(`~/service/data-service/categories`);
const initDB = require(`~/service/lib/init-db`);

const {
  mockArticles,
  mockCategories,
  foundArticlesWithSecondCategory,
} = require(`../mock-data`);
const {
  mockUsers,
} = require(`../users/users.mocks`);
const categories = require(`./categories`);

const app = express();
app.use(express.json());

const mockDB = new Sequelize(`sqlite::memory:`, {
  logging: false
});

beforeAll(async () => {
  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockArticles,
    users: mockUsers,
  });
  categories(app, new DataService(mockDB));
});


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
    expect(response.body.map((item) => item.name)).toEqual(
        expect.arrayContaining(mockCategories)
    );
  });
});

describe(`GET /categories/:id`, () => {
  const CATEGORY_ID = 2;
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories/${CATEGORY_ID}`);
  });

  it(`responds with 200 status code`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  it(`returns right data`, () => {
    const {id, name, articles} = response.body;

    expect(id).toBe(CATEGORY_ID);
    expect(name).toBe(mockCategories[1]);
    expect(articles.length).toBe(
        foundArticlesWithSecondCategory.length
    );
  });
});
