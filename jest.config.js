'use strict';

module.exports = {
  verbose: true,
  moduleNameMapper: {
    'root(.*)$': `<rootDir>/$1`,
    '~(.*)$': `<rootDir>/src/$1`,
  },
};
