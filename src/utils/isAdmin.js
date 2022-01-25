'use strict';

/**
 * @param {User} user
 * @return {boolean}
 */
const isAdmin = (user) => user.id === 1;

module.exports = {
  isAdmin,
};
