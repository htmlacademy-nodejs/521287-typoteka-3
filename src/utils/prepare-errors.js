'use strict';

/**
 * @param {Error} error
 * @return {Array<string>}
 */
const prepareErrors = (error) => {
  const {data} = error.response;

  let delimiter = `\n`;
  if (data.includes(`/n`)) {
    delimiter = `/n`;
  }

  return data.split(delimiter);
};


module.exports = {
  prepareErrors,
};
