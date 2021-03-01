"use strict";

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const HttpCode = require(`~/constants`);
const {getTime, buildQueryString} = require(`~/utils`);

const api = require(`~/express/api`).getAPI();

const ROOT = `articles`;
const UPLOAD_DIR = `../upload/img`;

const articlesRouter = new Router();
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();

    cb(null, `${uniqueName}.${extension}`);
  },
});

const upload = multer({storage});

articlesRouter.get(`/add`, async (req, res) => {
  const {query} = req;
  const article = Object.keys(query).length ? query : null;
  const categories = await api.getCategories();
  const date = new Date();

  res.render(`${ROOT}/add`, {
    article,
    categories,
    date,
  });
});

articlesRouter.post(`/add`, upload.single(`picture`), async (req, res) => {
  const {body, file} = req;
  const {title, announce, fullText, date, category = []} = body;
  const time = getTime(new Date());
  const createdDate = `${date}, ${time}`;
  const picture = file ? file.filename : null;

  const articleData = {
    title,
    announce,
    fullText,
    createdDate,
    categories: category,
    picture,
  };

  try {
    await api.createArticle(articleData);

    return res.redirect(`../my`);
  } catch (error) {
    const savedArticle = {
      ...articleData,
      createdDate: date,
    };
    const query = buildQueryString(savedArticle);

    return res.redirect(`/articles/add${query}`);
  }
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = res.req.params;

  const [article, categories] = await Promise.all([
    api.getArticle(id, true),
    api.getCategories(true),
  ]);
  const selectedCategoriesIds = article.categories.map((category) => category.id);

  res.render(`${ROOT}/article`, {article, categories, selectedCategoriesIds});
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;

  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(),
    ]);

    const articleCategories = article.categories.map(
        (category) => category.name
    );

    res.render(`${ROOT}/edit`, {article, categories, articleCategories});
  } catch (error) {
    return res.render(`errors/404`).status(HttpCode.NOT_FOUND);
  }

  return null;
});

articlesRouter.get(`/category/:id`, async (req, res) => {
  const {id} = req.params;

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
    categories,
    selectedCategoriesIds,
    articlesWithCategory,
  });
});

module.exports = articlesRouter;
