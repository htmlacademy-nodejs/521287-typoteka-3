'use strict';

const {Op} = require(`sequelize`);

const Aliase = require(`~/service/models/aliase`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
  }

  async findAll(searchText) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: searchText,
        }
      },
      include: [Aliase.CATEGORIES],
    });
    const result = articles.map((article) => article.get());

    return result;
  }
}

module.exports = SearchService;
