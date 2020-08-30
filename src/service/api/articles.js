'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const {
  articleExist,
  articleValidator,
  commentValidator,
} = require(`../middlewares`);

const route = new Router();

module.exports = (app, service, commentService) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = service.findAll();

    return res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, articleExist(service), (req, res) => {
    const {article} = res.locals;

    return res.status(HttpCode.OK).json(article);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = service.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.put(`/:articleId`, articleExist(service), (req, res) => {
    const {articleId} = req.params;
    const article = service.update(articleId);

    return res.status(HttpCode.OK).json(article);
  });

  route.delete(`/:articleId`, articleExist(service), (req, res) => {
    const {articleId} = req.params;
    const article = service.drop(articleId);

    return res.status(HttpCode.OK).json(article);
  });

  route.get(`/:articleId/comments`, articleExist(service), (req, res) => {
    const {article} = res.locals;
    const comments = commentService.findAll(article);

    return res.status(HttpCode.OK).json(comments);
  });

  route.post(
      `/:articleId/comments`,
      [articleExist(service), commentValidator],
      (req, res) => {
        const {article, comment} = res.locals;
        const newComment = commentService.create(article, comment);

        return res.status(HttpCode.OK).json(newComment);
      }
  );

  route.delete(
      `/:articleId/comments/:commentId`,
      articleExist(service),
      (req, res) => {
        const {commentId} = req.params;
        const {article} = res.locals;
        const newComment = commentService.drop(article, commentId);

        return res.status(HttpCode.OK).json(newComment);
      }
  );
};
