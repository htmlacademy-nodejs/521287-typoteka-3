'use strict';

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const API_PREFIX = `/api`;
const ANNOUNCE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 1000;
const ARTICLES_PER_PAGE = 8;
const POPULAR_ARTICLES_COUNT = 4;
const LAST_COMMENTS_COUNT = 4;

const DefaultPort = {
  SERVICE: 3000,
  EXPRESS: 8080,
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`,
};

const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};

const HttpMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
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
  MIN: 0,
  MAX: 2,
};

const DateRestrict = {
  MIN: 0,
  MAX: 3,
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  API_PREFIX,
  ANNOUNCE_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  ARTICLES_PER_PAGE,
  POPULAR_ARTICLES_COUNT,
  LAST_COMMENTS_COUNT,
  DefaultPort,
  Env,
  ExitCode,
  HttpMethod,
  HttpCode,
  AnnounceRestrict,
  PictureRestrict,
  DateRestrict,
};
