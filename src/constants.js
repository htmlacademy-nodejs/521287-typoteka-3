'use strict';

const AnnounceRestrict = {
  MIN: 1,
  MAX: 5,
};

const DateRestrict = {
  MIN: 0,
  MAX: 3,
};

const DEFAULT_COMMAND = `--help`;

const USER_ARGV_INDEX = 2;

const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};

module.exports = {
  AnnounceRestrict,
  DateRestrict,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode,
};
