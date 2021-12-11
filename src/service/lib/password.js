'use strict';

const {hash, hashSync} = require(`bcrypt`);

const SALT_ROUNDS = 10;

const hashWithConstSalt = (password) =>
  hash(password, SALT_ROUNDS);
const hashSyncWithConstSalt = (password) =>
  hashSync(password, SALT_ROUNDS);

module.exports = {
  hash: hashWithConstSalt,
  hashSync: hashSyncWithConstSalt,
};
