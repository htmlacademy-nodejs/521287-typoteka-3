'use strict';

const passwordUtils = require(`~/service/lib/password`);

const EMAIL = `ivanov@example.com`;
const NAME = `Иван`;
const SURNAME = `Иванов`;
const PASSWORD = `qwerty1234`;

const ValidUserData = {
  name: `Сидор`,
  surname: `Сидоров`,
  email: `sidorov@example.com`,
  password: PASSWORD,
  passwordRepeated: PASSWORD,
  avatar: `sidorov.jpg`,
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
    avatar: `avatar01.jpg`,
  },
  {
    name: `Пётр`,
    surname: `Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    avatar: `avatar01.jpg`,
  },
];

module.exports = {
  NAME,
  SURNAME,
  ValidUserData,
  AuthValidUserData,
  mockUsers,
};
