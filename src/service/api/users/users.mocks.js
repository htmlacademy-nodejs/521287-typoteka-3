'use strict';

const passwordUtils = require(`../../lib/password`);

const EMAIL = `ivanov@example.com`;
const USERNAME = `Иван Иванов`;
const PASSWORD = `qwerty1234`;

const ValidUserData = {
  name: `Сидор Сидоров`,
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
    name: USERNAME,
    email: EMAIL,
    passwordHash: passwordUtils.hashSync(PASSWORD),
    avatar: `avatar01.jpg`,
  },
  {
    name: `Пётр Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    avatar: `avatar01.jpg`,
  },
];

module.exports = {
  USERNAME,
  ValidUserData,
  AuthValidUserData,
  mockUsers,
};
