'use strict';

const Sequelize = require(`sequelize`);

const Aliase = require(`~/service/models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async create(data) {
    const category = await this._Category.create(data);

    return category.get();
  }

  async findOne(id) {
    const result = await this._Category.findByPk(id, {
      include: [Aliase.ARTICLES],
    });

    return result;
  }

  async findAll(withCount) {
    let options = {raw: true};
    if (withCount) {
      options = {
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(
                `COUNT`,
                Sequelize.col(`Category.id`)
            ),
            `count`
          ],
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Aliase.ARTICLE_CATEGORIES,
          attributes: [],
        }],
      };
    }

    let result = await this._Category.findAll(options);
    if (withCount) {
      result = result.map((item) => item.get());
    }

    return result;
  }

  async update({id, category}) {
    const [updatedRows] = await this._Category.update(category, {
      where: {id}
    });

    return Boolean(updatedRows);
  }

  async drop({id}) {
    const deletedRows = await this._Category.destroy({
      where: {id},
    });

    return Boolean(deletedRows);
  }
}

module.exports = CategoryService;
