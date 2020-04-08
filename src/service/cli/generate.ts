export {};

const { writeFile } = require(`fs`);

const { getRandomInt, shuffle } = require(`../../utils`);
const { TITLES, SENTENCES, CATEGORIES } = require(`../../data`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const generateOffers = (count: number) => {
  const title = TITLES[getRandomInt(0, TITLES.length - 1)];
  const createdDate = new Date();
  const announce = shuffle(SENTENCES).filter(
    (item: string, i: number) => i < getRandomInt(0, 4)
  );
  const fullText = shuffle(SENTENCES)
    .slice(0, getRandomInt(0, SENTENCES.length - 1))
    .join(` `);
  const category = shuffle(CATEGORIES).filter(
    (item: string, i: number) => i < getRandomInt(0, CATEGORIES.length - 1)
  );

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
  run(args: Array<string>) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer), null, 2);

    writeFile(FILE_NAME, content, (err: string) => {
      if (err) {
        return console.error(`Can't write data to file...`);
      }

      return console.log(`Operation success. File created`);
    });
  },
};
