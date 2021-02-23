'use strict';

const Aliase = require(`~/service/models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);

    return article.get();
  }

  async findOne(id) {
    const result = await this._Article.findByPk(id, {
      include: [Aliase.CATEGORIES],
    });

    return result;
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES];
    if (needComments) {
      include.push(Aliase.COMMENTS);
    }

    const articles = await this._Article.findAll({include});
    const result = articles.map((item) => item.get());

    return result;
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
