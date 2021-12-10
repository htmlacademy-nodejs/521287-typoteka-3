'use strict';

const request = require(`supertest`);

const {HttpCode} = require(`~/constants`);

const {
  ValidUserData,
  mockUsers,
} = require(`./users.mocks`);
const {createAPI} = require(`./utils`);

describe(`POST /users`, () => {
  describe(`+`, () => {
    let response;

    beforeAll(async () => {
      let app = await createAPI();

      response = await request(app)
        .post(`/users`)
        .send(ValidUserData);
    });

    it(`responds with 201 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });
  });

  describe(`−`, () => {
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    it(`responds with 400 status code when some required property is absent`, async () => {
      const requiredKeys = Object.keys(ValidUserData)
        // eslint-disable-next-line max-nested-callbacks
        .filter((key) => key !== `avatar`);

      for (const key of requiredKeys) {
        const badUserData = {...ValidUserData};
        delete badUserData[key];

        const response = await request(app)
          .post(`/users`)
          .send(badUserData);

        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });

    it(`responds with 400 status code when field type is wrong`, async () => {
      const badUsers = [
        {...ValidUserData, firstName: true},
        {...ValidUserData, email: 1},
      ];

      for (const badUserData of badUsers) {
        const response = await request(app)
          .post(`/users`)
          .send(badUserData);

        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });

    it(`responds with 400 status code when field isn't valid`, async () => {
      const badUsers = [
        {...ValidUserData, password: `short`, passwordRepeated: `short`},
        {...ValidUserData, email: `invalid`},
      ];

      for (const badUserData of badUsers) {
        const response = await request(app)
          .post(`/users`)
          .send(badUserData);

        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });

    it(`responds with 400 status code when passwords don't match`, async () => {
      const badUserData = {
        ...ValidUserData,
        passwordRepeated: `not ${ValidUserData.password}`
      };

      const response = await request(app)
          .post(`/users`)
          .send(badUserData);

      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    it(`responds with 400 status code when email was used`, async () => {
      const badUserData = {
        ...ValidUserData,
        email: mockUsers[0].email,
      };

      const response = await request(app)
          .post(`/users`)
          .send(badUserData);

      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });
});
