'use strict';

const {Router} = require(`express`);

const api = require(`~/express/api`).getAPI();
const {ARTICLES_PER_PAGE} = require(`~/constants`);

const ROOT = `main`;

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  // Получаем номер страницы
  let {page = 1} = req.query;
  page = +page;

  // Количество запрашиваемых объявлений
  // равно количеству объявлений на странице
  const limit = ARTICLES_PER_PAGE;

  // Количество объявлений, которое нам нужно пропустить, —
  // это количество объявлений на предыдущих страницах
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticles({limit, offset}),
    api.getCategories(true)
  ]);

  // Количество страниц — это общее количество объявлений,
  // поделённое на количество объявлений на странице
  // (с округлением вверх)
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  // Передаем собранные данные в шаблон
  res.render(`${ROOT}/main`, {articles, categories, page, totalPages});
});

mainRouter.get(`/search`, async (req, res) => {
  let search = null;
  let result = [];

  try {
    search = req.query.search;

    result = await api.search(search);
  } catch (error) {
    result = [];
  }

  return res.render(`${ROOT}/search`, {search, result});
});

mainRouter.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories();

  return res.render(`${ROOT}/categories`, {categories});
});

mainRouter.get(`/register`, (req, res) => res.render(`${ROOT}/register`));
mainRouter.get(`/login`, (req, res) => res.render(`${ROOT}/login`));

module.exports = mainRouter;
