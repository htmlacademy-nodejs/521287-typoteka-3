'use strict';

const Joi = require(`joi`);

const {HttpCode} = require(`~/constants`);

const ErrorRegisterMessage = {
  NAME: `Имя содержит некорректные символы`,
  NAME_REQUIRED: `Имя отсутствует`,
  SURNAME: `Фамилия содержит некорректные символы`,
  SURNAME_REQUIRED: `Фамилия отсутствует`,
  EMAIL: `Некорректный электронный адрес`,
  EMAIL_REQUIRED: `Электронный адрес отсутствует`,
  EMAIL_EXIST: `Электронный адрес уже используется`,
  PASSWORD: `Пароль содержит меньше 6-ти символов`,
  PASSWORD_REQUIRED: `Пароль отсутствует`,
  PASSWORD_REPEATED: `Пароли не совпадают`,
  PASSWORD_REPEATED_REQUIRED: `Подтверждение пароля отсутствует`,
  AVATAR: `Тип изображения аватара не поддерживается`
};

const schema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': ErrorRegisterMessage.EMAIL_REQUIRED,
    'string.email': ErrorRegisterMessage.EMAIL,
  }),
  name: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    'string.empty': ErrorRegisterMessage.NAME_REQUIRED,
    'string.pattern.base': ErrorRegisterMessage.NAME,
  }),
  surname: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    'string.empty': ErrorRegisterMessage.SURNAME_REQUIRED,
    'string.pattern.base': ErrorRegisterMessage.SURNAME
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': ErrorRegisterMessage.PASSWORD_REQUIRED,
    'string.min': ErrorRegisterMessage.PASSWORD
  }),
  passwordRepeated: Joi.string().required().valid(Joi.ref(`password`)).required().messages({
    'string.empty': ErrorRegisterMessage.PASSWORD_REPEATED_REQUIRED,
    'any.only': ErrorRegisterMessage.PASSWORD_REPEATED
  }),
  avatar: Joi.string().pattern(/\.(?:jpg|png|jpeg)$/i).allow(null).messages({
    'string.pattern.base': ErrorRegisterMessage.AVATAR,
  }),
});

module.exports = (service) => async (req, res, next) => {
  const newUser = req.body;

  try {
    await schema.validateAsync(
        newUser, {abortEarly: false}
    );
  } catch (error) {
    const errorMessage = error.details.map((err) => err.message).join(`/n`);

    return res.status(HttpCode.BAD_REQUEST).send(errorMessage);
  }

  const userByEmail = await service.findByEmail(newUser.email);
  if (userByEmail) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(ErrorRegisterMessage.EMAIL_EXIST);
  }

  return next();
};
