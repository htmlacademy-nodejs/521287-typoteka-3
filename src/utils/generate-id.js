'use strict';

const {nanoid} = require(`nanoid`);

const {
  MAX_ID_LENGTH,
} = require(`~/constants`);

const generateId = () => nanoid(MAX_ID_LENGTH);

module.exports = {
  generateId,
};
