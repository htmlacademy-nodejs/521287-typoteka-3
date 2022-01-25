'use strict';

const {Sequelize, Op} = require(`sequelize`);

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

  async findOne({id, userId, withComments}) {
    const options = {
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
      where: [{
        id,
      }]
    };

    if (userId) {
      options.where.push({userId});
    }

    if (withComments) {
      options.include.push({
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

      options.order = [
        [{model: this._Comment, as: Aliase.COMMENTS}, `createdAt`, `DESC`]
      ];
    }

    return await this._Article.findOne(options);
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

  async findMostCommented({limit}) {
    const articles = await this._Article.findAll({
      limit,
      attributes: {
        include: [
          Sequelize.fn(`COUNT`, Sequelize.col(`comments.id`)),
          `count`
        ],
      },
      include: {
        model: this._Comment,
        as: Aliase.COMMENTS,
        attributes: [],
        duplicating: false,
      },
      group: [Sequelize.col(`Article.id`)],
      having: Sequelize.where(
          Sequelize.fn(`COUNT`, Sequelize.col(`comments.id`)),
          {
            [Op.gte]: 1,
          }
      ),
      order: [
        [`count`, `desc`]
      ],
    });

    const result = articles.map((article) => article.get());

    return result;
  }

  async findPage({limit, offset, withComments}) {
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

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      distinct: true,
    });
    const articles = rows;

    return {count, articles};
  }

  async update(id, article) {
    const [updatedRows] = await this._Article.update(article, {
      where: {id}
    });

    return Boolean(updatedRows);
  }

  async drop({id, userId}) {
    const deletedRows = await this._Article.destroy({
      where: {
        id,
        userId,
      },
    });

    return Boolean(deletedRows);
  }
}

module.exports = ArticleService;
