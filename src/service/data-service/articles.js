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

  update(id, article) {
    const oldArticle = this.findOne(id);

    return Object.assign(oldArticle, article);
  }

  drop(id) {
    const article = this.findOne(id);

    if (!article) {
      return null;
    }

    this._articles = this._articles.filter((item) => item.id !== id);

    return article;
  }
}

module.exports = ArticleService;
