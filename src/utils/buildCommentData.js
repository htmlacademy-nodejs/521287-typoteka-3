'use strict';

const buildCommentData = (text, user) => ({
  text,
  user: {
    id: user.id,
    name: user.name,
    surname: user.surname,
    avatar: user.avatar,
  },
});

module.exports = {
  buildCommentData,
};
