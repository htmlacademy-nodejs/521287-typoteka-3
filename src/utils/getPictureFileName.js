'use strict';

const getPictureFileName = (number) => `item${(`0` + number).slice(-2)}.jpg`;

module.exports = {
  getPictureFileName,
};
