"use strict";

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const HttpCode = require(`~/constants`);
const {
  buildArticleData,
  getArticleCategoriesIds,
  prepareErrors,
} = require(`~/utils`);
const {checkAuth} = require(`~/express/middlewares`);

const api = require(`~/express/api`).getAPI();

const ROOT = `articles`;
const UPLOAD_DIR = `../upload/img`;

const articlesRouter = new Router();
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const getEditArticleData = async (articleId) => {
  const [article, categories] = await Promise.all([
    api.getArticle(articleId, false),
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

articlesRouter.get(`/add`, checkAuth, async (req, res) => {
  const {session, query} = req;
  const {user} = session;
  const article = Object.keys(query).length ? query : null;
  const categories = await api.getCategories();
  const date = new Date();

  res.render(`${ROOT}/add`, {
    user,
    article,
    categories,
    date,
  });
});

articlesRouter.post(`/add`,
    [
      checkAuth,
      upload.single(`picture`)
    ], async (req, res) => {
      const article = buildArticleData(req);

      try {
        await api.createArticle(article);

        return res.redirect(`../my`);
      } catch (error) {
        const articleCategories = article.categories;
        const categories = await getAddArticleCategories();
        const validationMessages = prepareErrors(error);

        return res.render(`${ROOT}/add`, {
          article,
          articleCategories,
          categories,
          validationMessages,
        });
      }
    });

articlesRouter.get(`/edit/:id`, checkAuth, async (req, res) => {
  const {params, session} = req;
  const {id} = params;
  const {user} = session;

  try {
    const [article, categories] = await getEditArticleData(Number(id));
    const articleCategories = getArticleCategoriesIds(article);

    res.render(`${ROOT}/add`, {
      user,
      article,
      articleCategories,
      categories,
    });
  } catch (error) {
    return res.render(`errors/404`).status(HttpCode.NOT_FOUND);
  }

  return null;
});
articlesRouter.post(
    `/edit/:id`,
    [
      checkAuth,
      upload.single(`picture`),
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

        return res.render(`${ROOT}/add`, {
          article,
          articleCategories,
          categories,
          validationMessages,
        });
      }
    });

articlesRouter.get(`/:id`, async (req, res) => {
  const {params, session} = req;
  const {id} = params;
  const {user} = session;

  const [article, categories] = await Promise.all([
    api.getArticle(id, true),
    api.getCategories(true),
  ]);
  const selectedCategoriesIds = getArticleCategoriesIds(article);

  res.render(`${ROOT}/article`, {
    user,
    article,
    categories,
    selectedCategoriesIds,
  });
});

articlesRouter.post(
    `/:id/comments`,
    checkAuth,
    async (req, res) => {
      const {params, body, session} = req;
      const {id} = params;
      const {text} = body;
      const {user} = session;

      const commentData = {
        userId: user.id,
        text,
      };

      try {
        const comment = await api.createComment(id, commentData);

        return res.redirect(`/${ROOT}/${id}#${comment.id}`);
      } catch (error) {
        const [article, categories] = await Promise.all([
          api.getArticle(id, true),
          api.getCategories(true),
        ]);
        const validationMessages = prepareErrors(error);

        return res.render(`${ROOT}/article`, {
          user,
          article,
          categories,
          newComment: text,
          validationMessages,
        });
      }
    }
);

articlesRouter.get(`/category/:id`, async (req, res) => {
  const {params, session} = req;
  const {id} = params;
  const {user} = session;

  const [selectedCategory, categories, articles] = await Promise.all([
    api.getCategory(id),
    api.getCategories(true),
    api.getArticles({comments: true}),
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
