'use strict';

const {Op} = require(`sequelize`);

const Aliase = require(`~/service/models/aliase`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._User = sequelize.models.User;
  }

  async findAll(searchText) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.iLike]: `%${searchText}%`,
        }
      },
      include: [
        Aliase.CATEGORIES,
        {
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      order: [
        [`createdAt`, `DESC`]
      ]
    });
    const result = articles.map((article) => article.get());

    return result;
  }
}

module.exports = SearchService;
