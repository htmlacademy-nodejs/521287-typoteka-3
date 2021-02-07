'use strict';

const {writeFile} = require(`fs`).promises;

const {AnnounceRestrict, ANNOUNCE_MAX_LENGTH, PictureRestrict} = require(`../../constants`);
const {getLogger} = require(`../lib/logger`);
const {
  getRandomInt,
  shuffle,
  getPictureFileName,
  generateComments,
  readContent,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `fill-db.sql`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const MAX_COMMENTS = 4;

const logger = getLogger({name: `fill`});

const generateArticles = (
    count,
    titles,
    categoryCount,
    userCount,
    sentences,
    commentList
) =>
  Array(count)
    .fill({})
    .map((_, index) => {
      const title = titles[getRandomInt(0, titles.length - 1)];
      const announce = shuffle(sentences)
        .slice(0, getRandomInt(AnnounceRestrict.MIN, AnnounceRestrict.MAX))[0]
        .substr(0, ANNOUNCE_MAX_LENGTH);
      const description = shuffle(sentences).slice(1, 5).join(` `);
      const picture = getPictureFileName(
          getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)
      );
      const comments = generateComments(
          getRandomInt(1, MAX_COMMENTS),
          index + 1,
          userCount,
          commentList
      );
      const categories = [getRandomInt(1, categoryCount)];
      const userId = getRandomInt(1, userCount);

      return {
        title,
        announce,
        description,
        picture,
        comments,
        categories,
        userId,
      };
    });

module.exports = {
  name: `--fill`,
  async run(args) {
    const [
      sentences,
      titles,
      categories,
      commentSentences,
    ] = await Promise.all([
      readContent(FILE_SENTENCES_PATH, logger),
      readContent(FILE_TITLES_PATH, logger),
      readContent(FILE_CATEGORIES_PATH, logger),
      readContent(FILE_COMMENTS_PATH, logger),
    ]);

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const users = [
      {
        email: `ivanov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Иван`,
        lastName: `Иванов`,
        avatar: `avatar1.jpg`,
      },
      {
        email: `petrov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Пётр`,
        lastName: `Петров`,
        avatar: `avatar2.jpg`,
      },
    ];

    const articles = generateArticles(
        countArticle,
        titles,
        categories.length,
        users.length,
        sentences,
        commentSentences
    );

    const comments = articles.flatMap((article) => article.comments);
    const articleCategories = articles.map((article, index) => ({
      articleId: index + 1,
      categoryId: article.categories[0],
    }));

    const userValues = users
      .map(
          ({email, passwordHash, firstName, lastName, avatar}) =>
            `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
      )
      .join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const articleValues = articles
      .map(
          ({title, announce, description, picture, userId}) =>
            `('${title}', '${announce}', '${description}', '${picture}', ${userId}, now())`
      )
      .join(`,\n`);

    const articleCategoryValues = articleCategories
      .map(({articleId, categoryId}) => `(${articleId}, ${categoryId})`)
      .join(`,\n`);

    const commentValues = comments
      .map(
          ({text, userId, articleId}) =>
            `('${text}', ${userId}, ${articleId}, now())`
      )
      .join(`,\n`);

    const content = `INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
${userValues};

INSERT INTO categories(name) VALUES
${categoryValues};

ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(title, announce, description, picture, user_id, created_at) VALUES
${articleValues};
ALTER TABLE articles ENABLE TRIGGER ALL;

ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories(article_id, category_id) VALUES
${articleCategoryValues};
ALTER TABLE articles_categories ENABLE TRIGGER ALL;

ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments(text, user_id, article_id, created_at) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;`;

    try {
      await writeFile(FILE_NAME, content);

      logger.info(`Operation success. File created.`);
    } catch (err) {
      logger.error(`Can't write data to file...`);
    }
  },
};
