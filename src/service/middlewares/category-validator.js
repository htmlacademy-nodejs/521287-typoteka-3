'use strict';

const Joi = require(`joi`);

const {HttpCode} = require(`~/constants`);
const {
  buildValidationErrorMessage,
} = require(`~/utils`);

const ErrorCategoryMessage = {
  NAME_REQUIRED: `Название категории отсутствует`,
  NAME_MIN: `Название категории содержит меньше 5 символов`,
  NAME_MAX: `Название категории содержит больше 30 символов`,
};

const schema = Joi.object({
  name: Joi.string().min(5).max(30).required().messages({
    'string.empty': ErrorCategoryMessage.NAME_REQUIRED,
    'string.min': ErrorCategoryMessage.NAME_MIN,
    'string.max': ErrorCategoryMessage.NAME_MAX,
  }),
});

const CategoryValidator = async (req, res, next) => {
  const Category = req.body;

  const {error} = await schema.validate(
      Category,
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

module.exports = CategoryValidator;
