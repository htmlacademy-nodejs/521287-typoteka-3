'use strict';

const SERVER_URL = `http://localhost:3000`;
const COUNT_COMMENT_ELEMENTS = 4;

const createCommentElement = ({
  id,
  text,
  articleId,
  user = {},
}) => {
  const {
    avatar,
    name,
    surname,
  } = user;

  const commentTemplate = document.querySelector(`#comment-template`);
  const commentElement = commentTemplate.cloneNode(true).content;

  commentElement.querySelector(`.last__list-image`).src = `/img/${avatar}`;
  commentElement.querySelector(`.last__list-name`).textContent = `${name} ${surname}`;
  commentElement.querySelector(`.last__list-link`).href = `articles/${articleId}#${id}`;
  commentElement.querySelector(`.last__list-link`).textContent = text;

  return commentElement;
};

const updateCommentElements = (comment) => {
  const commentNewestBlock = document.querySelector('.main-page__last');
  const commentListElements = commentNewestBlock.querySelector('.last__list');
  const commentElements = commentListElements.querySelectorAll('last__list-item');

  if (commentElements.length === COUNT_COMMENT_ELEMENTS) {
    const lastComment = commentElements[commentElements.length - 1];
    lastComment.remove();
  }

  commentListElements.prepend(createCommentElement(comment));
};

(() => {
  const socket = io(SERVER_URL, {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": `abcd`
    }
  });

  socket.addEventListener(`comment:create`, (comment) => {
    if (location.pathname !== '/') {
      return;
    }

    updateCommentElements(comment);
  });
})();
