'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);

const {checkAuth, checkAdmin} = require(`~/express/middlewares`);
const api = require(`~/express/api`).getAPI();

const {
  prepareErrors,
} = require(`~/utils`);

const ROOT = `my`;

const myRouter = new Router();
const csrfProtection = csrf();

myRouter.get(`/`, [checkAuth, checkAdmin], async (req, res) => {
  const {user} = req.session;
  const userId = user.id;

  const articles = await api.getArticles({userId});

  res.render(`${ROOT}/my`, {user, articles});
});

myRouter.get(`/comments`, [checkAuth, checkAdmin], async (req, res) => {
  const {user} = req.session;
  const userId = user.id;

  const articles = await api.getArticles({userId, withComments: true});

  res.render(`${ROOT}/comments`, {user, articles});
});

myRouter.get(
    `/categories`,
    [
      checkAuth,
      checkAdmin,
      csrfProtection,
    ],
    async (req, res) => {
      const {user} = req.session;
      const csrfToken = req.csrfToken();

      const categories = await api.getCategories();

      return res.render(`${ROOT}/categories`, {
        user,
        csrfToken,
        categories,
      });
    }
);
myRouter.post(
    `/categories`,
    [
      checkAuth,
      checkAdmin,
      csrfProtection,
    ],
    async (req, res) => {
      const {name} = req.body;

      try {
        const newCategory = await api.createCategory({name});

        const {id} = newCategory;

        return res.redirect(`/${ROOT}/categories#category${id}`);
      } catch (error) {
        const {user} = req.session;
        const csrfToken = req.csrfToken();
        const categories = await api.getCategories();
        const createValidationMessages = prepareErrors(error);

        return res.render(`${ROOT}/categories`, {
          user,
          csrfToken,
          categories,
          name,
          createValidationMessages,
        });
      }
    }
);
myRouter.post(
    `/categories/:id`,
    [
      checkAuth,
      checkAdmin,
      csrfProtection,
    ],
    async (req, res) => {
      const {params, body} = req;

      const {id} = params;
      const {
        categoryOldName,
        categoryNewName,
        action,
      } = body;

      if (action === `editCategory`) {
        try {
          if (categoryOldName === categoryNewName) {
            const error = [`Новое название категории совпадает со старым`];
            throw error;
          }
          const name = categoryNewName;

          await api.editCategory({id, name});

          return res.redirect(`/${ROOT}/categories#category${id}`);
        } catch (error) {
          const {user} = req.session;
          const csrfToken = req.csrfToken();
          const categories = await api.getCategories();
          const editValidationMessages = prepareErrors(error);

          return res.render(`${ROOT}/categories`, {
            user,
            csrfToken,
            categories,
            categoryNewName,
            editedId: id,
            editValidationMessages,
          });
        }
      }

      if (action === `removeCategory`) {
        try {
          await api.removeCategory({id});

          return res.redirect(`/${ROOT}/categories`);
        } catch (error) {
          const {status, statusText} = error.response;

          return res.status(status).send(statusText);
        }
      }

      return res.redirect(`/${ROOT}/categories`);
    }
);

module.exports = myRouter;
