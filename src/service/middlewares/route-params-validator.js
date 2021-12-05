'use strict';

const Joi = require(`joi`);

const {HttpCode} = require(`~/constants`);
const {
  buildValidationErrorMessage,
} = require(`~/utils`);

const schema = Joi.object({
  articleId: Joi.number().integer().min(1),
  commentId: Joi.number().integer().min(1)
});

module.exports = async (req, res, next) => {
  const params = req.params;

  const {error} = await schema.validate(params);

  if (error) {
    const errorMessage = buildValidationErrorMessage(error);

    return res
      .status(HttpCode.BAD_REQUEST)
      .send(errorMessage);
  }

  return next();
};
