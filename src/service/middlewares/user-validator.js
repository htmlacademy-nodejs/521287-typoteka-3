'use strict';

const Joi = require(`joi`);

const {HttpCode} = require(`~/constants`);

const ErrorRegisterMessage = {
  NAME: `Имя содержит некорректные символы`,
  EMAIL: `Некорректный электронный адрес`,
  EMAIL_EXIST: `Электронный адрес уже используется`,
  PASSWORD: `Пароль содержит меньше 6-ти символов`,
  PASSWORD_REPEATED: `Пароли не совпадают`,
  AVATAR: `Изображение не выбрано или тип изображения не поддерживается`
};

const schema = Joi.object({
  name: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    'string.pattern.base': ErrorRegisterMessage.NAME
  }),
  email: Joi.string().email().required().messages({
    'string.email': ErrorRegisterMessage.EMAIL
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': ErrorRegisterMessage.PASSWORD
  }),
  passwordRepeated: Joi.string().required().valid(Joi.ref(`password`)).required().messages({
    'any.only': ErrorRegisterMessage.PASSWORD_REPEATED
  }),
  avatar: Joi.string().required().messages({
    'string.empty': ErrorRegisterMessage.AVATAR
  })
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
