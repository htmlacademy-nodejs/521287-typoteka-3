'use strict';

const routeParamsValidator = require(`./route-params-validator`);
const articleExist = require(`./articleExist`);
const articleValidator = require(`./articleValidator`);
const commentValidator = require(`./commentValidator`);

module.exports = {
  routeParamsValidator,
  articleExist,
  articleValidator,
  commentValidator,
};
