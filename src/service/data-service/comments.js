
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

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return Boolean(deletedRows);
  }
}

module.exports = CommentService;
