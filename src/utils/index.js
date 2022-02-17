'use strict';

// common getters
const {
  getDate,
} = require(`./get-date`);
const {
  getTime,
} = require(`./get-time`);
const {
  getRandomInt,
} = require(`./get-random-int`);
const {
  getRandomSubarray,
} = require(`./get-random-subarray`);

// getters
const {
  getPictureFileName,
} = require(`./get-picture-file-name`);
const {
  getCategoriesFromBody,
} = require(`./get-categories-from-body`);
const {
  getArticleCategoriesIds,
} = require(`./get-article-categoriesIds`);

// helpers
const {
  readContent,
} = require(`./read-content`);
const {
  shuffle,
} = require(`./shuffle`);
const {
  prepareErrors,
} = require(`./prepare-errors`);
const {
  isAdmin,
} = require(`./is-admin`);

// helpers-generators
const {
  generateId,
} = require(`./generate-id`);
const {
  generateComments,
} = require(`./generate-comments`);
const {
  generateCommentsWithUsers,
} = require(`./generate-comments-with-users`);
const {
  generateCommentsWithoutIds,
} = require(`./generate-comments-without-ids`);

// builders
const {
  buildQueryString,
} = require(`./build-query-string`);
const {
  buildValidationErrorMessage,
} = require(`./build-validation-error-message`);
const {
  buildArticleData,
} = require(`./build-article-data`);
const {
  buildCommentData,
} = require(`./build-comment-data`);

module.exports = {
  // common getters
  getDate,
  getTime,
  getRandomInt,
  getRandomSubarray,

  // getters
  getPictureFileName,
  getCategoriesFromBody,
  getArticleCategoriesIds,

  // helpers
  readContent,
  shuffle,
  prepareErrors,
  isAdmin,

  // helpers-generators
  generateId,
  generateComments,
  generateCommentsWithUsers,
  generateCommentsWithoutIds,

  // builders
  buildQueryString,
  buildValidationErrorMessage,
  buildArticleData,
  buildCommentData,
};
