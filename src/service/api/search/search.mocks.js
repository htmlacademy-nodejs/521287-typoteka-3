'use strict';

const mockCategories = [
  `Музыка`,
  `Программирование`,
  `Разное`,
  `Кино`,
  `IT`,
  `Железо`,
];

const mockArticles = [
  {
    "title": `Ёлки. История деревьев и людей`,
    "createdAt": `2020-11-09T23:54:48.599Z`,
    "announce": `Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "description": `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Первая большая ёлка была установлена только в 1938 году. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Из под его пера вышло 8 платиновых альбомов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "categories": [
      `Музыка`,
    ],
    "comments": [
      {
        "text": `Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Хочу такую же футболку :-)`
      },
      {
        "text": `Планируете записать видосик на эту тему? Совсем немного...`
      },
    ]
  },
  {
    "title": `Обзор новейшего смартфона Айфон 13 Про`,
    "createdAt": `2020-13-09T09:00:00.000Z`,
    "announce": `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "description": `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    "categories": [
      `Кино`,
      `IT`,
      `Железо`,
      `Программирование`
    ],
    "comments": [
      {
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то?`
      },
      {
        "text": `Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты?`
      }
    ]
  },
];

const foundArticleTitle = mockArticles[1].title;

module.exports = {
  mockCategories,
  mockArticles,
  foundArticleTitle,
};
