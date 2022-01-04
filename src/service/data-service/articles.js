'use strict';

const Aliase = require(`~/service/models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);

    return article.get();
  }

  async findOne(id, needComments) {
    const include = [Aliase.CATEGORIES];
    if (needComments) {
      include.push(Aliase.COMMENTS);
    }

    const result = await this._Article.findByPk(id, {include});

    return result;
  }

  async findAll({userId, withComments}) {
    const include = [
      Aliase.CATEGORIES,
      {
        model: this._User,
        as: Aliase.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];
    if (withComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
    }

    let where;
    if (userId) {
      where = {userId};
    }

    const articles = await this._Article.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ],
      where,
    });
    const result = articles.map((item) => item.get());

    return result;
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
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
      distinct: true,
    });

    return {count, articles: rows};
  }

  async update(id, article) {
    const [updatedRows] = await this._Article.update(article, {
      where: {id}
    });

    return Boolean(updatedRows);
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id},
    });

    return Boolean(deletedRows);
  }
}

module.exports = ArticleService;
