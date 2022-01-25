"use strict";

const {Router} = require(`express`);
const csrf = require(`csurf`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const HttpCode = require(`~/constants`);
const {
  buildArticleData,
  getArticleCategoriesIds,
  prepareErrors,
} = require(`~/utils`);
const {checkAuth, checkAdmin} = require(`~/express/middlewares`);

const api = require(`~/express/api`).getAPI();

const ROOT = `articles`;
const UPLOAD_DIR = `../upload/img`;

const articlesRouter = new Router();
const csrfProtection = csrf();
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const getEditArticleData = async (id, userId) => {
  const [article, categories] = await Promise.all([
    api.getArticle({id, userId, withComments: true}),
    api.getCategories()
  ]);

  return [article, categories];
};

const getAddArticleCategories = () => {
  return api.getCategories({withCount: false});
};

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();

    cb(null, `${uniqueName}.${extension}`);
  },
});

const upload = multer({storage});

articlesRouter.get(`/add`,
    [
      checkAuth,
      checkAdmin,
      csrfProtection
    ], async (req, res) => {
      const {session, query} = req;
      const {user} = session;
      const article = Object.keys(query).length ? query : null;
      const categories = await api.getCategories();
      const date = new Date();
      const csrfToken = req.csrfToken();

      res.render(`${ROOT}/add`, {
        user,
        article,
        categories,
        date,
        csrfToken,
      });
    });

articlesRouter.post(`/add`,
    [
      checkAuth,
      checkAdmin,
      upload.single(`picture`),
      csrfProtection,
    ], async (req, res) => {
      const {user} = req.session;
      const article = buildArticleData(req);

      try {
        await api.createArticle(article);

        return res.redirect(`../my`);
      } catch (error) {
        const articleCategories = article.categories;
        const categories = await getAddArticleCategories();
        const validationMessages = prepareErrors(error);
        const csrfToken = req.csrfToken();

        return res.render(`${ROOT}/add`, {
          user,
          article,
          articleCategories,
          categories,
          validationMessages,
          csrfToken,
        });
      }
    });

articlesRouter.get(`/edit/:id`,
    [
      checkAuth,
      checkAdmin,
      csrfProtection
    ], async (req, res) => {
      const {params, session} = req;
      const {id} = params;
      const {user} = session;
      const userId = user.id;
      const csrfToken = req.csrfToken();

      try {
        const [article, categories] = await getEditArticleData(Number(id), userId);
        const articleCategories = getArticleCategoriesIds(article);

        res.render(`${ROOT}/add`, {
          user,
          article,
          articleCategories,
          categories,
          csrfToken,
        });
      } catch (error) {
        return res.render(`errors/404`).status(HttpCode.NOT_FOUND);
      }

      return null;
    }
);
articlesRouter.post(
    `/edit/:id`,
    [
      checkAuth,
      checkAdmin,
      upload.single(`picture`),
      csrfProtection,
    ],
    async (req, res) => {
      const {id} = req.params;
      const article = buildArticleData(req);

      try {
        await api.editArticle(Number(id), article);

        return res.redirect(`/articles/${id}`);
      } catch (error) {
        const articleCategories = article.categories;
        const categories = await getAddArticleCategories();
        const validationMessages = prepareErrors(error);
        const csrfToken = req.csrfToken();

        return res.render(`${ROOT}/add`, {
          article,
          articleCategories,
          categories,
          validationMessages,
          csrfToken,
        });
      }
    });
articlesRouter.post(
    `/:id`,
    [
      checkAuth,
      checkAdmin,
    ],
    async (req, res) => {
      const {params, session} = req;

      const {id} = params;
      const {user} = session;
      const userId = user.id;

      try {
        await api.removeArticle({
          id,
          userId,
        });

        return res.redirect(`/my`);
      } catch (error) {
        const {status, statusText} = error.response;

        return res
            .status(status)
            .send(statusText);
      }
    }
);

articlesRouter.get(`/:id`,
    csrfProtection, // Для коммментирования
    async (req, res) => {
      const {params, session} = req;
      const {id} = params;
      const {user} = session;
      const userId = user ? user.id : null;
      const csrfToken = req.csrfToken();

      const [article, categories] = await Promise.all([
        api.getArticle({id, userId, withComments: true}),
        api.getCategories({withCount: true}),
      ]);
      const selectedCategoriesIds = getArticleCategoriesIds(article);

      res.render(`${ROOT}/article`, {
        user,
        article,
        categories,
        selectedCategoriesIds,
        csrfToken,
      });
    });

articlesRouter.get(
    `/:id/comments`,
    (_, res) => res.redirect(`./`)
);

articlesRouter.post(
    `/:id/comments`,
    [
      checkAuth,
      csrfProtection,
    ],
    async (req, res) => {
      const {params, body, session} = req;
      const {id} = params;
      const {text} = body;
      const {user} = session;
      const userId = user.id;

      const commentData = {
        userId,
        text,
      };

      try {
        const comment = await api.createComment(id, commentData);

        return res.redirect(`/${ROOT}/${id}#${comment.id}`);
      } catch (error) {
        const [article, categories] = await Promise.all([
          api.getArticle({id, userId, withComments: true}),
          api.getCategories({withCount: true}),
        ]);
        const validationMessages = prepareErrors(error);
        const csrfToken = req.csrfToken();

        return res.render(`${ROOT}/article`, {
          user,
          article,
          categories,
          newComment: text,
          validationMessages,
          csrfToken,
        });
      }
    }
);

articlesRouter.post(
    `/:articleId/comments/:commentId`,
    [
      checkAuth,
      checkAdmin,
    ],
    async (req, res) => {
      const {params, session} = req;
      const {articleId, commentId} = params;
      const {user} = session;
      const userId = user.id;

      try {
        await api.removeComment({
          articleId,
          commentId,
          userId,
        });

        return res.redirect(`/my/comments`);
      } catch (error) {
        const {status, statusText} = error.response;

        return res
          .status(status)
          .send(statusText);
      }
    }
);

articlesRouter.get(`/category/:id`, async (req, res) => {
  const {params, session} = req;
  const {id} = params;
  const {user} = session;
  const userId = user ? user.id : null;

  const [selectedCategory, categories, articles] = await Promise.all([
    api.getCategory(id),
    api.getCategories({withCount: true}),
    api.getArticles({userId, withComments: true}),
  ]);
  const articlesWithCategory = articles.filter((article) =>
    article.categories.some((category) => category.id === selectedCategory.id)
  );
  const selectedCategoriesIds = [selectedCategory.id];

  res.render(`${ROOT}/articles-with-category`, {
    user,
    categories,
    selectedCategoriesIds,
    articlesWithCategory,
  });
});

module.exports = articlesRouter;
