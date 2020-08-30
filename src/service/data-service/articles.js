'use strict';

const {generateId} = require(`../../utils`);

class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  create(article) {
    const newArticle = Object.assign({id: generateId()}, article);

    this._articles.push(newArticle);

    return newArticle;
  }

  findAll() {
    return this._articles;
  }

  findOne(id) {
    return this._articles.find((item) => item.id === id);
  }
}

module.exports = ArticleService;
