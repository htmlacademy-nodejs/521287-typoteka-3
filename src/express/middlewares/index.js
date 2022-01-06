'use strict';

const checkAuth = require(`./checkAuth`);
const checkAdmin = require(`./checkAdmin`);
const upload = require(`./upload`);

module.exports = {
  checkAuth,
  checkAdmin,
  upload,
};
