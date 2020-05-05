'use strict';

const {readFile, writeFile} = require(`fs`).promises;
const chalk = require(`chalk`);

const {AnnounceRestrict} = require(`../../constants`);
const {getRandomInt, shuffle, getDate} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const generateOffers = (count, titles, sentences, categories) => {
  const offers = [];

  for (let i = 0; i < count; i++) {
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

    offers.push(({
      title,
      createdDate,
      announce,
      fullText,
      category,
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
      await writeFile(FILE_NAME, content);

      console.log(chalk.green(`Operation success. File created`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  },
};
