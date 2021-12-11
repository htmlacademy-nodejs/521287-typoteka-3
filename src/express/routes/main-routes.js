'use strict';

const {Router} = require(`express`);

const {ARTICLES_PER_PAGE} = require(`~/constants`);
const api = require(`~/express/api`).getAPI();
const {upload} = require(`~/express/middlewares`);
const {
  prepareErrors,
} = require(`~/utils`);

const ROOT = `main`;

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;

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
  res.render(`${ROOT}/main`, {
    user,
    articles,
    categories,
    page,
    totalPages,
  });
});

mainRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;
  let search = null;
  let result = [];

  try {
    search = req.query.search;

    result = await api.search(search);
  } catch (error) {
    result = [];
  }

  return res.render(`${ROOT}/search`, {user, search, result});
});

mainRouter.get(`/categories`, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();

  return res.render(`${ROOT}/categories`, {user, categories});
});

mainRouter.get(`/register`, (req, res) => {
  const {user} = req.session;

  return res.render(`${ROOT}/register`, {user});
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

    return res.redirect(`/login`);
  } catch (error) {
    const validationMessages = prepareErrors(error);

    return res.render(`${ROOT}/register`, {
      validationMessages,
    });
  }
});

mainRouter.get(`/login`, (req, res) => {
  const {user} = req.session;

  return res.render(`${ROOT}/login`, {user});
});

mainRouter.post(`/login`, async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await api.auth(email, password);

    req.session.user = user;
    await req.session.save();
    return res.redirect(`/`);
  } catch (error) {
    const validationMessages = prepareErrors(error);

    return res.render(`${ROOT}/login`, {
      email,
      password,
      validationMessages,
    });
  }
});

mainRouter.get(`/logout`, async (req, res) => {
  delete req.session.user;
  await req.session.save();

  res.redirect(`/`);
});

module.exports = mainRouter;
