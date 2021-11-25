'use strict';

const {getCategoriesFromBody} = require(`./getCategoriesFromBody`);

describe(`getCategoriesFromBody`, () => {
  it(`returns empty array when categories aren't chosen`, () => {
    const Body = {
      'title': `Заголовок`,
    };

    const result = getCategoriesFromBody(Body);
    const expected = [];

    expect(result).toStrictEqual(expected);
  });

  it(`returns correct array when categories are chosen`, () => {
    const Body = {
      'title': `Заголовок`,
      'category-3': `on`,
      'category-7': `on`,
    };

    const result = getCategoriesFromBody(Body);
    const expected = [3, 7];

    expect(result).toStrictEqual(expected);
  });
});
