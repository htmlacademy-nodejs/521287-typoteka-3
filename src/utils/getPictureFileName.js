'use strict';

const Pictures = [
  `forest@2x.jpg`,
  `skyscraper@2x.jpg`,
  `sea-fullsize@2x.jpg`,
];

const getPictureFileName = (number) => Pictures[number];

module.exports = {
  getPictureFileName,
};
