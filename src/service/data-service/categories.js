'use strict';

const Sequelize = require(`sequelize`);

const Aliase = require(`~/service/models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._OfferCategory = sequelize.models.OfferCategory;
  }

  async findOne(id) {
    const result = await this._Category.findByPk(id, {
      include: [Aliase.ARTICLES],
    });

    return result;
  }

  async findAll(needCount) {
    if (needCount) {
      const categories = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(
                `COUNT`,
                `*`
            ),
            `count`
          ],
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._OfferCategory,
          as: Aliase.OFFER_CATEGORIES,
          attributes: [],
        }],
      });
      const result = categories.map((item) => item.get());

      return result;
    } else {
      const result = await this._Category.findAll({raw: true});

      return result;
    }
  }
}

module.exports = CategoryService;
