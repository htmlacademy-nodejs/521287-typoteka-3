'use strict';

const Joi = require(`joi`);

const {HttpCode} = require(`~/constants`);
const {
  buildValidationErrorMessage,
} = require(`~/utils`);

const ErrorCommentMessage = {
  TEXT: `Комментарий содержит меньше 20 символов`,
  USER_ID: `Некорректный идентификатор пользователя`
};

const schema = Joi.object({
  text: Joi.string().min(20).required().messages({
    'string.min': ErrorCommentMessage.TEXT,
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorCommentMessage.USER_ID,
  })
});

const commentValidator = async (req, res, next) => {
  const comment = req.body;

  const {error} = await schema.validate(
      comment,
      {abortEarly: false}
  );

  if (error) {
    const errorMessage = buildValidationErrorMessage(error);

    return res
      .status(HttpCode.BAD_REQUEST)
      .send(errorMessage);
  }

  return next();
};

module.exports = commentValidator;
