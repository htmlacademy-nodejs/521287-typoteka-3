
'use strict';

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }

  async create(articleId, comment) {
    const newComment = await this._Comment.create({
      articleId,
      ...comment,
    });

    return newComment;
  }

  async findAll(articleId) {
    const result = await this._Comment.findAll({
      where: {articleId},
      raw: true,
    });

    return result;
  }

  async drop({articleId, commentId, userId}) {
    const articleByUser = await this._Article.findOne({
      where: {
        id: articleId,
        userId,
      }
    });

    if (!articleByUser) {
      return false;
    }

    const deletedRows = await this._Comment.destroy({
      where: {
        id: commentId,
      }
    });

    return Boolean(deletedRows);
  }
}

module.exports = CommentService;
