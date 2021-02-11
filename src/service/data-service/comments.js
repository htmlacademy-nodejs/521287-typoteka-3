'use strict';

const {generateId} = require(`~/utils`);

class CommentService {
  create(article, comment) {
    const newComment = Object.assign(
        {
          id: generateId(),
        },
        comment
    );

    article.comments.push(newComment);

    return newComment;
  }

  findAll(article) {
    return article.comments;
  }

  findOne(article, commentId) {
    return article.comments.find((item) => item.id === commentId);
  }

  drop(article, commentId) {
    const dropComment = this.findOne(article, commentId);

    if (!dropComment) {
      return null;
    }

    article.comments = article.comments.filter((item) => item.id !== commentId);

    return dropComment;
  }
}

module.exports = CommentService;
