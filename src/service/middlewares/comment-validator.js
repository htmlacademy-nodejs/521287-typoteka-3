'use strict';

const Joi = require(`joi`);

const {HttpCode} = require(`~/constants`);
const {
  buildValidationErrorMessage,
} = require(`~/utils`);

const ErrorCommentMessage = {
  TEXT: `Комментарий содержит меньше 20 символов`,

  User: {
    ID: `Некорректный идентификатор пользователя`,
    ID_REQUIRED: `Идентификатор пользователя отсутствует`,
    NAME_REQUIRED: `Имя пользователя отсутствует`,
    SURNAME_REQUIRED: `Фамилия пользователя отсутствует`,
    AVATAR_REQUIRED: `Аватар пользователя отсутствует`,
  }
};

const schema = Joi.object({
  text: Joi.string().min(20).required().messages({
    'string.min': ErrorCommentMessage.TEXT,
  }),
  user: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      'number.empty': ErrorCommentMessage.User.ID_REQUIRED,
      'number.base': ErrorCommentMessage.User.ID,
    }),
    name: Joi.string().required().messages({
      'string.empty': ErrorCommentMessage.User.NAME_REQUIRED,
    }),
    surname: Joi.string().required().messages({
      'string.empty': ErrorCommentMessage.User.SURNAME_REQUIRED,
    }),
    avatar: Joi.string().required().messages({
      'string.empty': ErrorCommentMessage.User.AVATAR_REQUIRED,
    }),
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
