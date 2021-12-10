'use strict';

const {Router} = require(`express`);

const {ARTICLES_PER_PAGE} = require(`~/constants`);
const api = require(`~/express/api`).getAPI();
const upload = require(`~/express/middlewares/upload`);
const {
  prepareErrors,
} = require(`~/utils`);

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

mainRouter.get(`/register`, (req, res) => {
  return res.render(`${ROOT}/register`);
});

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const {
    email,
    name,
    surname,
    password,
    passwordRepeated,
  } = body;
  const avatar = file ? file.filename : null;
  const userData = {
    email,
    name,
    surname,
    password,
    passwordRepeated,
    avatar,
  };

  try {
    await api.createUser(userData);

    res.redirect(`/login`);
  } catch (error) {
    const validationMessages = prepareErrors(error);

    return res.render(`${ROOT}/register`, {
      validationMessages,
    });
  }
});

mainRouter.get(`/login`, (req, res) => res.render(`${ROOT}/login`));

module.exports = mainRouter;
