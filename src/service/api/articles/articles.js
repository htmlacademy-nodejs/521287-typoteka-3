"use strict";

const {Router} = require(`express`);

const {HttpCode} = require(`~/constants`);
const {
  routeParamsValidator,
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
    const {userId, offset, limit, withComments} = req.query;
    let result;

    if (limit || offset) {
      result = await service.findPage({limit, offset});
    } else {
      result = await service.findAll({
        userId,
        withComments,
      });
    }

    return res.status(HttpCode.OK).json(result);
  });

  route.get(`/:articleId`,
      [routeParamsValidator, articleExist(service)],
      (req, res) => {
        const {article} = res.locals;

        return res.status(HttpCode.OK).json(article);
      });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await service.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.put(
      `/:articleId`,
      [
        routeParamsValidator,
        articleExist(service),
        articleValidator,
      ],
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

  route.delete(`/:articleId`,
      [routeParamsValidator, articleExist(service)],
      async (req, res) => {
        const {params, body} = req;

        const {articleId: id} = params;
        const {userId} = body;

        const deletedOffer = await service.drop({
          id,
          userId,
        });

        if (!deletedOffer) {
          return res
            .status(HttpCode.NOT_FOUND)
            .send(`Article #${id} wasn't found`);
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

  route.get(`/:articleId/comments`,
      [routeParamsValidator, articleExist(service)],
      async (req, res) => {
        const {articleId} = req.params;

        const comments = await commentService.findAll(articleId);

        return res.status(HttpCode.OK).json(comments);
      });

  route.delete(
      `/:articleId/comments/:commentId`,
      [routeParamsValidator, articleExist(service)],
      async (req, res) => {
        const {params, body} = req;

        const {articleId, commentId} = params;
        const {userId} = body;

        const deletedComment = await commentService.drop({
          articleId,
          commentId,
          userId,
        });

        if (!deletedComment) {
          return res
            .status(HttpCode.NOT_FOUND)
            .send(`Comment with ${commentId} wasn't found`);
        }

        return res.status(HttpCode.OK).json(deletedComment);
      }
  );
};
