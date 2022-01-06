'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);

const {ARTICLES_PER_PAGE} = require(`~/constants`);
const api = require(`~/express/api`).getAPI();
const {
  checkAuth,
  checkAdmin,
  upload,
} = require(`~/express/middlewares`);
const {
  prepareErrors,
} = require(`~/utils`);

const ROOT = `main`;

const mainRouter = new Router();
const csrfProtection = csrf();

mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  const userId = user ? user.id : null;

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
    api.getArticles({userId, limit, offset, withComments: true}),
    api.getCategories(true)
  ]);

  // Количество страниц — это общее количество объявлений,
  // поделённое на количество объявлений на странице
  // (с округлением вверх)
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  if (count) {
    // Передаем собранные данные в шаблон
    return res.render(`${ROOT}/main`, {
      user,
      articles,
      categories,
      page,
      totalPages,
    });
  } else {
    return res.render(`${ROOT}/main-empty`, {
      user,
    });
  }
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

mainRouter.get(
    `/categories`,
    [checkAuth, checkAdmin],
    async (req, res) => {
      const {user} = req.session;
      const categories = await api.getCategories();

      return res.render(`${ROOT}/categories`, {user, categories});
    });

mainRouter.get(`/register`, csrfProtection, (req, res) => {
  const {user} = req.session;
  const csrfToken = req.csrfToken();

  return res.render(`${ROOT}/register`, {
    user,
    csrfToken,
  });
});

mainRouter.post(`/register`,
    [
      csrfProtection,
      upload.single(`avatar`),
    ], async (req, res) => {
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

mainRouter.get(`/login`, csrfProtection, (req, res) => {
  const {user} = req.session;
  const csrfToken = req.csrfToken();

  return res.render(`${ROOT}/login`, {
    user,
    csrfToken,
  });
});

mainRouter.post(`/login`, csrfProtection, async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await api.auth(email, password);

    req.session.user = user;
    await req.session.save();
    return res.redirect(`/`);
  } catch (error) {
    const csrfToken = req.csrfToken();
    const validationMessages = prepareErrors(error);

    return res.render(`${ROOT}/login`, {
      email,
      password,
      validationMessages,
      csrfToken,
    });
  }
});

mainRouter.get(`/logout`, async (req, res) => {
  delete req.session.user;
  await req.session.save();

  res.redirect(`/`);
});

module.exports = mainRouter;
