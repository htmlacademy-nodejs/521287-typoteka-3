'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const HttpCode = require(`../../constants`);
const {getTime} = require(`../../utils`);
const api = require(`../api`).getAPI();

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
  }
});

const upload = multer({storage});

articlesRouter.get(`/add`, (req, res) => res.render(`${ROOT}/add`));
articlesRouter.post(`/add`, upload.single(`picture`), async (req, res) => {
  const {body, file} = req;
  const {
    title,
    announce,
    fullText,
    date,
    category,
  } = body;
  const time = getTime(new Date());
  const picture = file ? file.filename : null;

  const articleData = {
    title,
    announce,
    fullText,
    createdDate: `${date}, ${time}`,
    category: category || [],
    picture,
  };

  try {
    await api.createArticle(articleData);
    return res.redirect(`../my`);
  } catch (error) {
    return res.redirect(`back`);
  }
});

articlesRouter.get(`/:id`, (req, res) => {
  const {id} = res.req.params;

  res.render(`${ROOT}/post`, {id});
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;

  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(),
    ]);

    res.render(`${ROOT}/edit`, {article, categories});
  } catch (error) {
    return res.render(`errors/404`).status(HttpCode.NOT_FOUND);
  }

  return null;
});

articlesRouter.get(`/category/:id`, (req, res) => {
  const {id} = res.req.params;

  res.render(`${ROOT}/articles-by-category`, {id});
});

module.exports = articlesRouter;
