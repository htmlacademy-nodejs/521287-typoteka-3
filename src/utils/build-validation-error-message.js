'use strict';

/**
 * Формирует сообщение ошибки валидации
 *
 * @param {Joi.ValidationError} error — Ошибка валидации
 * @return {string} — Сообщение ошибки
 */
const buildValidationErrorMessage = (error = ``) =>
  error && error.details
  && error.details.map((err) => err.message).join(`\n`);

module.exports = {
  buildValidationErrorMessage,
};
