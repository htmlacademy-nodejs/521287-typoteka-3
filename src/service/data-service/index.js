'use strict';

const ArticleService = require(`./articles`);
const CategoryService = require(`./categories`);
const SearchService = require(`./search`);
const CommentService = require(`./comments`);
const UserService = require(`./users`);

module.exports = {
  ArticleService,
  CategoryService,
  SearchService,
  CommentService,
  UserService,
};
