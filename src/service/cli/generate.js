'use strict';

const {readFile, writeFile} = require(`fs`).promises;
const chalk = require(`chalk`);

const {AnnounceRestrict} = require(`../../constants`);
const {generateId, getRandomInt, shuffle, getDate, generateComments} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const generateOffers = (count, titles, sentences, categories, comments) => {
  const offers = [];

  for (let i = 0; i < count; i++) {
    const id = generateId();
    const title = titles[getRandomInt(0, titles.length - 1)];
    const createdDate = getDate();
    const announce = shuffle(sentences).slice(
        0,
        getRandomInt(AnnounceRestrict.MIN, AnnounceRestrict.MAX)
    );
    const fullText = shuffle(sentences)
    .slice(0, getRandomInt(0, sentences.length - 1))
    .join(` `);
    const category = shuffle(categories).slice(0, getRandomInt(1, 4));
    const commentsGenerated = generateComments(count, comments);

    offers.push(({
      id,
      title,
      createdDate,
      announce,
      fullText,
      category,
      comments: commentsGenerated,
    }));
  }

  return offers;
};

const readContent = async (filePath) => {
  try {
    const content = await readFile(filePath, `utf-8`);

    return content.split(`\n`).filter((item) => item !== ``);
  } catch (err) {
    console.error(chalk.red(err));

    return [];
  }
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [titles, sentences, categories, comments] = await Promise.all([
      await readContent(FILE_TITLES_PATH),
      await readContent(FILE_SENTENCES_PATH),
      await readContent(FILE_CATEGORIES_PATH),
      await readContent(FILE_COMMENTS_PATH)
    ]);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(
        generateOffers(countOffer, titles, sentences, categories, comments),
        null,
        2
    );

    try {
      await writeFile(FILE_NAME, content);

      console.log(chalk.green(`Operation success. File created`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  },
};
