'use strict';

const request = require(`supertest`);

const {HttpCode} = require(`~/constants`);

const {
  NAME,
  AuthValidUserData: ValidUserData,
} = require(`./users.mocks`);
const {createAPI} = require(`./utils`);

const ENDPOINT = `/users/auth`;

describe(`POST /users/auth`, () => {
  describe(`+`, () => {
    let response;

    beforeAll(async () => {
      const app = await createAPI();

      response = await request(app)
        .post(ENDPOINT)
        .send(ValidUserData);
    });

    it(`responds with 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`returns correct user name`, () => {
      expect(response.body.name).toBe(NAME);
    });
  });

  describe(`−`, () => {
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    it(`responds with 401 status code when email is incorrect`, async () => {
      const badUserData = {
        email: `not-${ValidUserData.email}`,
        password: ValidUserData.password,
      };
      const response = await request(app)
        .post(ENDPOINT)
        .send(badUserData);

      expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
    });

    it(`responds with 401 status code when password is incorrect`, async () => {
      const badUserData = {
        email: ValidUserData.email,
        password: `not-${ValidUserData.password}`,
      };
      const response = await request(app)
        .post(ENDPOINT)
        .send(badUserData);

      expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
    });
  });
});
