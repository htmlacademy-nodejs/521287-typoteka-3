'use strict';

const routeParamsValidator = require(`./route-params-validator`);
const articleExist = require(`./article-exist`);
const articleValidator = require(`./article-validator`);
const categoryValidator = require(`./category-validator`);
const commentValidator = require(`./comment-validator`);

module.exports = {
  routeParamsValidator,
  articleExist,
  articleValidator,
  categoryValidator,
  commentValidator,
};
