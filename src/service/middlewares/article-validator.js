'use strict';

const Joi = require(`joi`);

const {HttpCode} = require(`~/constants`);

const {
  buildValidationErrorMessage,
} = require(`~/utils`);

const ErrorArticleMessage = {
  USER_ID: `Некорректный идентификатор пользователя`,
  TITLE_REQUIRED: `Заголовок отсутствует`,
  TITLE_MIN: `Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `Заголовок не может содержать более 250 символов`,
  PICTURE: `Формат изображения не jpg или png`,
  CREATED_AT: `Дата публикации отсутствует`,
  CATEGORIES: `Не выбрана ни одна категория`,
  ANNOUNCE_REQUIRED: `Анонс отсутствует`,
  ANNOUNCE_MIN: `Анонс не может содержать меньше 30 символов`,
  ANNOUNCE_MAX: `Анонс не может содержать более 250 символов`,
  DESCRIPTION_MAX: `Полный текст не может содержать более 1000 символов`,
  TYPE: `Не выбран ни один тип поста`,
  SUM: `Сумма не может быть меньше 100`
};

const schema = Joi.object({
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorArticleMessage.USER_ID
  }),
  title: Joi.string().min(30).max(250).required().messages({
    'string.empty': ErrorArticleMessage.TITLE_REQUIRED,
    'string.min': ErrorArticleMessage.TITLE_MIN,
    'string.max': ErrorArticleMessage.TITLE_MAX
  }),
  picture: Joi.string().pattern(/\.(?:jpg|png)$/i).allow(``).messages({
    'string.pattern.base': ErrorArticleMessage.PICTURE
  }),
  createdAt: Joi.string().isoDate().required().messages({
    'string.empty': ErrorArticleMessage.CREATED_AT
  }),
  categories: Joi.array().min(1).items(
      Joi.number().integer().positive().messages({
        'number.base': ErrorArticleMessage.CATEGORIES
      })
  ).min(1).required().messages({
    'array.min': ErrorArticleMessage.CATEGORIES,
  }),
  announce: Joi.string().min(30).max(250).required().messages({
    'string.empty': ErrorArticleMessage.ANNOUNCE_REQUIRED,
    'string.min': ErrorArticleMessage.ANNOUNCE_MIN,
    'string.max': ErrorArticleMessage.ANNOUNCE_MAX
  }),
  description: Joi.string().allow(``).max(1000).messages({
    'string.max': ErrorArticleMessage.DESCRIPTION_MAX
  })
});

const ArticleValidator = async (req, res, next) => {
  const newArticle = req.body;

  const {error} = await schema.validate(
      newArticle,
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

module.exports = ArticleValidator;
