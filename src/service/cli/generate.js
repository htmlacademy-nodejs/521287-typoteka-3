"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {getRandomInt, shuffle} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const generateOffers = (count, titles, sentences, categories) => {
  const title = titles[getRandomInt(0, titles.length - 1)];
  const createdDate = new Date();
  const announce = shuffle(sentences).slice(0, getRandomInt(1, 4));
  const fullText = shuffle(sentences)
    .slice(0, getRandomInt(0, sentences.length - 1))
    .join(` `);
  const category = shuffle(categories).slice(0, getRandomInt(1, 4));

  return Array(count)
    .fill({})
    .map(() => ({
      title,
      createdDate,
      announce,
      fullText,
      category,
    }));
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);

    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));

    return [];
  }
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [titles, sentences, categories] = await Promise.all([
      await readContent(FILE_TITLES_PATH),
      await readContent(FILE_SENTENCES_PATH),
      await readContent(FILE_CATEGORIES_PATH),
    ]);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(
        generateOffers(countOffer, titles, sentences, categories),
        null,
        2
    );

    try {
      await fs.writeFile(FILE_NAME, content);

      console.log(chalk.green(`Operation success. File created`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  },
};
