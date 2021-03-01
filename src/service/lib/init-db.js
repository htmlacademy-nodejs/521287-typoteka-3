'use strict';

const Aliase = require(`~/service/models/aliase`);
const defineModels = require(`~/service/models`);

module.exports = async (sequelize, {categories, articles}) => {
  const {Category, Article} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  const categoryIdByName = categoryModels.reduce(
      (acc, next) => ({
        [next.name]: next.id,
        ...acc,
      }),
      {}
  );

  const articlePromises = articles.map(async (article) => {
    const articleModel = await Article.create(article, {
      include: [Aliase.COMMENTS],
    });
    const articleCategories = article.categories.map(
        (name) => categoryIdByName[name]
    );

    await articleModel.addCategories(articleCategories);
  });
  await Promise.all(articlePromises);
};
