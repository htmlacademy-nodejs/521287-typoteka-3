'use strict';

const fs = require(`fs`);

const {
  getRandomInt
} = require(`../../utils.js`);
const {
  TITLES,
  SENTENCES,
  CATEGORIES,
} = require(`../../data`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const generateOffers = (count) => {
  return Array(count)
    .fill({})
    .map(() => ({
      title: TITLES[getRandomInt(0, TITLES.length - 1)],
      createdDate: new Date(),
      announce: SENTENCES[getRandomInt(0, SENTENCES.length - 1)],
      fullText: SENTENCES[getRandomInt(0, SENTENCES.length - 1)],
      category: [CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)]],
    }));
};

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer), null, 2);

    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        return console.error(`Can't write data to file...`);
      }

      return console.log(`Operation success. File created`);
    });
  }
};
