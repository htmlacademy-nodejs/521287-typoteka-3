'use strict';

class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    return this._articles;
  }
}

module.exports = ArticleService;
