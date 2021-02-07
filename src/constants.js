'use strict';

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`,
};

const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

const AnnounceRestrict = {
  MIN: 1,
  MAX: 5,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const DateRestrict = {
  MIN: 0,
  MAX: 3,
};

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const API_PREFIX = `/api`;
const ANNOUNCE_MAX_LENGTH = 100;

module.exports = {
  Env,
  ExitCode,
  HttpCode,
  AnnounceRestrict,
  PictureRestrict,
  DateRestrict,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  API_PREFIX,
  ANNOUNCE_MAX_LENGTH,
};
