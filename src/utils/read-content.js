'use strict';

const {readFile} = require(`fs`).promises;

const readContent = async (filePath, logger = console) => {
  try {
    const content = await readFile(filePath, `utf-8`);
    logger.info(`breakpoint`);

    return content.trim().split(`\n`);
  } catch (error) {
    logger.error(`Error when we're reading file: ${error.message}`);

    return [];
  }
};

module.exports = {
  readContent,
};
