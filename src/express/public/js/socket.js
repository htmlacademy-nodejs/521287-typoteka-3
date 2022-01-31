'use strict';

const SERVER_URL = `http://localhost:3000`;
const POPULAR_ARTICLES_COUNT = 4;
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

  const commentTemplate = document.querySelector(`#last-comment-template`);
  const commentElement = commentTemplate.cloneNode(true).content;

  commentElement.querySelector(`.last__list-image`).src = `/img/${avatar}`;
  commentElement.querySelector(`.last__list-name`).textContent = `${name} ${surname}`;
  commentElement.querySelector(`.last__list-link`).href = `articles/${articleId}#${id}`;
  commentElement.querySelector(`.last__list-link`).textContent = text;

  return commentElement;
};

const createHotArticleElement = ({
  id,
  announce,
  count,
}, isLastElement) => {
  const articleTemplate = document.querySelector(`#hot-article-template`);
  const articleElement = articleTemplate.cloneNode(true).content;

  const articleItem = articleElement.querySelector(`.hot__list-item`);
  const articleLink = articleElement.querySelector(`.hot__list-link`);
  const articleCounter = articleElement.querySelector(`.hot__link-sup`)

  articleItem.dataset.id = id;
  articleLink.href = `/articles/${id}`;
  articleLink.textContent = announce;
  articleCounter.textContent = count;
  articleLink.append(articleCounter);

  if (isLastElement) {
    articleItem.classList.add('hot__list-item--end');
  }

  return articleElement;
};

const updateCommentElements = (comment) => {
  const commentNewestBlock = document.querySelector('.main-page__last');
  const commentListElements = commentNewestBlock.querySelector('.last__list');
  const commentElements = commentListElements.querySelectorAll('.last__list-item');

  if (commentElements.length === COUNT_COMMENT_ELEMENTS) {
    const lastComment = commentElements[commentElements.length - 1];
    lastComment.remove();
  }

  commentListElements.prepend(createCommentElement(comment));
};

const updateHotArticleElements = async () => {
  const articleHotBlock = document.querySelector('.main-page__hot');
  const articleListElements = articleHotBlock.querySelector('.hot__list');

  const ROUTE = `articles/popular?limit=${POPULAR_ARTICLES_COUNT}`;
  const response = await fetch(`${SERVER_URL}/api/${ROUTE}`)
  const result = await response.json();

  articleListElements.innerHTML = '';
  result.forEach((article, i) => {
    const isLastElement = i === POPULAR_ARTICLES_COUNT - 1;
    const articleElement = createHotArticleElement(
      article,
      isLastElement,
    );

    articleListElements.append(articleElement);
  });
}

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
    updateHotArticleElements();
  });
})();
