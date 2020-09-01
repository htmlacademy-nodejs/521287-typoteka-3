'use strict';

const ArticleService = require(`./articles`);
const CategoryService = require(`./categories`);
const SearchService = require(`./search`);
const CommentService = require(`./comments`);

module.exports = {
  ArticleService,
  CategoryService,
  SearchService,
  CommentService,
};
