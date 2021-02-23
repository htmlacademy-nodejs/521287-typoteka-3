"use strict";

const {Router} = require(`express`);

const {HttpCode} = require(`~/constants`);
const {
  articleExist,
  articleValidator,
  commentValidator,
} = require(`~/service/middlewares`);

module.exports = (app, service, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  /**
   * Статья
   */
  route.get(`/`, async (req, res) => {
    const {comments} = req.query;

    const articles = await service.findAll(comments);

    return res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, articleExist(service), (req, res) => {
    const {article} = res.locals;

    return res.status(HttpCode.OK).json(article);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await service.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.put(
      `/:articleId`,
      [articleExist(service), articleValidator],
      async (req, res) => {
        const {articleId} = req.params;

        const updated = await service.update(articleId, req.body);

        if (!updated) {
          return res
            .status(HttpCode.NOT_FOUND)
            .send(`Article #${articleId} wasn't found`);
        }

        return res.status(HttpCode.OK).json(`Offer was updated`);
      }
  );

  route.delete(`/:articleId`, articleExist(service), async (req, res) => {
    const {articleId} = req.params;

    const deletedOffer = await service.drop(articleId);

    if (!deletedOffer) {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Article #${articleId} wasn't found`);
    }

    return res.status(HttpCode.OK).json(deletedOffer);
  });

  /**
   * Комментарии к статье
   */
  route.post(
      `/:articleId/comments`,
      [articleExist(service), commentValidator],
      async (req, res) => {
        const {articleId} = req.params;

        const comment = await commentService.create(articleId, req.body);

        return res.status(HttpCode.CREATED).json(comment);
      }
  );

  route.get(`/:articleId/comments`, articleExist(service), async (req, res) => {
    const {articleId} = req.params;

    const comments = await commentService.findAll(articleId);

    return res.status(HttpCode.OK).json(comments);
  });

  route.delete(
      `/:articleId/comments/:commentId`,
      articleExist(service),
      async (req, res) => {
        const {commentId} = req.params;

        const deletedComment = await commentService.drop(commentId);

        if (!deletedComment) {
          return res
            .status(HttpCode.NOT_FOUND)
            .send(`Comment with ${commentId} wasn't found`);
        }

        return res.status(HttpCode.OK).json(deletedComment);
      }
  );
};
