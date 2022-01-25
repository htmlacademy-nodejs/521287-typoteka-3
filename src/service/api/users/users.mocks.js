'use strict';

const passwordUtils = require(`~/service/lib/password`);

const EMAIL = `admin@typoteka.ru`;
const NAME = `Иван`;
const SURNAME = `Иванов`;
const PASSWORD = `admin`;

const ValidUserData = {
  name: `Иссидора`,
  surname: `Сидорова`,
  email: `sidorova@example.com`,
  password: `qwerty1234`,
  passwordRepeated: `qwerty1234`,
  avatar: `avatar-3.png`,
};

const AuthValidUserData = {
  email: EMAIL,
  password: PASSWORD,
};

const mockUsers = [
  {
    name: NAME,
    surname: SURNAME,
    email: EMAIL,
    passwordHash: passwordUtils.hashSync(PASSWORD),
    avatar: `avatar-1.png`,
  },
  {
    name: `Пётр`,
    surname: `Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    avatar: `avatar-5.png`,
  },
];

module.exports = {
  NAME,
  SURNAME,
  ValidUserData,
  AuthValidUserData,
  mockUsers,
};
