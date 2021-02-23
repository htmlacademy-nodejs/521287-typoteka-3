'use strict';

const {ExitCode, AnnounceRestrict, PictureRestrict} = require(`~/constants`);
const {getLogger} = require(`~/service/lib/logger`);
const sequelize = require(`~/service/lib/sequelize`);
const initDatabase = require(`~/service/lib/init-db`);

const {
  getPictureFileName,
  getRandomInt,
  getRandomSubarray,
  shuffle,
  generateCommentsWithoutIds,
  readContent,
} = require(`~/utils`);

const DEFAULT_COUNT = 1;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const logger = getLogger({name: `fill-db`});

const generateArticles = (
    count,
    titles,
    sentences,
    categoryList,
    commentList
) =>
  Array(count)
    .fill({})
    .map(() => {
      const title = titles[getRandomInt(0, titles.length - 1)];
      const announce = shuffle(sentences)
        .slice(0, getRandomInt(AnnounceRestrict.MIN, AnnounceRestrict.MAX))
        .join(` `);
      const description = shuffle(sentences)
        .slice(0, getRandomInt(0, sentences.length - 1))
        .join(` `);
      const picture = getPictureFileName(
          getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)
      );
      const categories = getRandomSubarray(categoryList);
      const comments = generateCommentsWithoutIds(count, commentList);

      console.log(`announce in fill-db`);
      console.log(announce);

      return {
        title,
        announce,
        description,
        picture,
        categories,
        comments,
      };
    });

module.exports = {
  name: `--fill-db`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (error) {
      logger.error(`An error occured: ${error.message}`);
      process.exit(ExitCode.ERROR);
    }
    logger.info(`Connection to database was established`);

    const [titles, sentences, categories, comments] = await Promise.all([
      await readContent(FILE_TITLES_PATH, logger),
      await readContent(FILE_SENTENCES_PATH, logger),
      await readContent(FILE_CATEGORIES_PATH, logger),
      await readContent(FILE_COMMENTS_PATH, logger),
    ]);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const articles = generateArticles(
        countOffer,
        titles,
        sentences,
        categories,
        comments
    );

    return initDatabase(sequelize, {articles, categories});
  },
};
