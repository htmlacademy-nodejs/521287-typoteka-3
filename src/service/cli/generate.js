"use strict";

const { writeFile } = require(`fs`);

const { getRandomInt, shuffle } = require(`../../utils`);
const { TITLES, SENTENCES, CATEGORIES } = require(`../../data`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const generateOffers = (count) => {
  const title = TITLES[getRandomInt(0, TITLES.length - 1)];
  const createdDate = new Date();
  const announce = shuffle(SENTENCES).slice(0, getRandomInt(1, 4));
  const fullText = shuffle(SENTENCES)
    .slice(0, getRandomInt(0, SENTENCES.length - 1))
    .join(` `);
  const category = shuffle(CATEGORIES).slice(0, getRandomInt(1, 4));

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

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer), null, 2);

    writeFile(FILE_NAME, content, (err) => {
      if (err) {
        return console.error(`Can't write data to file...`);
      }

      return console.log(`Operation success. File created`);
    });
  },
};
