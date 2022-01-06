'use strict';

const {isAdmin} = require(`~/utils`);

module.exports = (req, res, next) => {
  const {user} = req.session;

  const isUserAdmin = isAdmin(user);

  if (!isUserAdmin) {
    return res.redirect(`/login`);
  }

  return next();
};
