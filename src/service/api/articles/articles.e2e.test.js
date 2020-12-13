'use strict';

const request = require(`supertest`);

const {HttpCode} = require(`../../../constants`);
const {createAPI} = require(`./utils`);

describe(`GET /articles`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  it(`responds with 200 status code`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  it(`returns list of 5 articles`, () => {
    expect(response.body.length).toBe(5);
  });

  it(`returns right data`, () => {
    expect(response.body[0].id).toBe(`Qzw3gs`);
  });
});

describe(`GET /articles/{articleId}`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/ghJIDB`);
  });

  it(`responds with 200 status code`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  it(`returns right data`, () => {
    expect(response.body.title).toBe(`Борьба с прокрастинацией`);
  });
});

describe(`POST /articles`, () => {
  describe(`+`, () => {
    const app = createAPI();
    const newArticle = {
      title: `Созидание интереснее потребления`,
      createdDate: `2020-12-13 12:30:52`,
      category: [`Продуктивность`],
      announce: `Почему государству выгодно, чтобы мы потребляли больше, как это вредно с точки зрения эволюции и чем интереснее заниматься в жизни`,
      fullText: `Душа, как бы это ни казалось парадоксальным, спонтанно иллюстрирует конфликтный импульс, таким образом, стратегия поведения, выгодная отдельному человеку, ведет к коллективному проигрышу. Гештальт, по определению, разрушаем. Однако Э.Дюркгейм утверждал, что мышление начинает девиантный интеракционизм. Как было показано выше, лидерство последовательно`,
    };
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/articles`).send(newArticle);
    });

    it(`responds with 201 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    it(`returns created article`, () => {
      expect(response.body).toEqual(expect.objectContaining(newArticle));
    });

    it(`creates new article`, async () => {
      const articleResponse = await request(app).get(`/articles`);

      expect(articleResponse.body.length).toBe(6);
    });
  });

  describe(`−`, () => {
    const app = createAPI();
    const newArticle = {
      createdDate: `2020-12-13 12:30:52`,
      category: [`Продуктивность`],
      announce: `Почему государству выгодно, чтобы мы потребляли больше, как это вредно с точки зрения эволюции и чем интереснее заниматься в жизни`,
      fullText: `Душа, как бы это ни казалось парадоксальным, спонтанно иллюстрирует конфликтный импульс, таким образом, стратегия поведения, выгодная отдельному человеку, ведет к коллективному проигрышу. Гештальт, по определению, разрушаем. Однако Э.Дюркгейм утверждал, что мышление начинает девиантный интеракционизм. Как было показано выше, лидерство последовательно`,
    };

    it(`responds with 400 status code when some required property is absent`, async () => {
      for (const key of Object.keys(newArticle)) {
        const badArticle = {...newArticle};
        delete badArticle[key];

        const response = await request(app).post(`/articles`).send(badArticle);

        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });
  });
});

describe(`PUT /articles/{articleId}`, () => {
  describe(`+`, () => {
    const app = createAPI();
    const changedArticle = {
      title: `Изменённый заголовок`,
      createdDate: `2021-01-01 09:00:00`,
      category: [`Разное`],
      announce: `Изменённый анонс`,
      fullText: `Изменённый текст`,
    };
    let response;

    beforeAll(async () => {
      response = await request(app).put(`/articles/Adjh2S`).send(changedArticle);
    });

    it(`responds with 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`returns changed article`, () => {
      expect(response.body).toEqual(expect.objectContaining(changedArticle));
    });

    it(`changes certain article`, async () => {
      const articleResponse = await request(app).get(`/articles/Adjh2S`);

      expect(articleResponse.body.title).toBe(`Изменённый заголовок`);
    });
  });

  describe(`−`, () => {
    it(`responds with 404 status code when article doesn't exist`, async () => {
      const app = createAPI();
      const validArticle = {
        title: `Изменённый заголовок`,
        createdDate: `2021-01-01 09:00:00`,
        category: [`Разное`],
        announce: `Изменённый анонс`,
        fullText: `Изменённый текст`,
      };
      const response = await request(app)
        .put(`/articles/NOEXIST`)
        .send(validArticle);

      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    it(`responds with 400 status code when some required property is absent`, async () => {
      const app = createAPI();
      const invalidArticle = {
        createdDate: `2021-01-01 09:00:00`,
        category: [`Разное`],
        announce: `Изменённый анонс`,
        fullText: `Изменённый текст`,
      };
      const response = await request(app)
        .put(`/articles/Adjh2S`)
        .send(invalidArticle);

      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });
});

describe(`DELETE /articles/{articleId}`, () => {
  describe(`+`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app).delete(`/articles/Adjh2S`);
    });

    it(`responds with 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`returns deleted article`, () => {
      expect(response.body.id).toBe(`Adjh2S`);
    });

    it(`deletes certain article`, async () => {
      const articleResponse = await request(app).get(`/articles`);

      expect(articleResponse.body.length).toBe(4);
    });
  });

  describe(`−`, () => {
    it(`responds with 404 status code when article doesn't exist`, async () => {
      const app = createAPI();
      const response = await request(app).delete(`/articles/M3HI0J`);

      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`GET /articles/{articleId}/comments`, () => {
  describe(`+`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app).get(`/articles/mSlg3L/comments`);
    });

    it(`responds with 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`returns changed article`, () => {
      expect(response.body.length).toBe(5);
    });

    it(`returns right data`, () => {
      expect(response.body[0].id).toBe(`5KNBah`);
    });
  });

  describe(`−`, () => {
    it(`responds with 404 status code when article doesn't exist`, async () => {
      const app = createAPI();
      const response = await request(app).delete(`/articles/NOEXIST/comments`);

      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`POST /articles/{articleId}/comments`, () => {
  describe(`+`, () => {
    const app = createAPI();
    const newComment = {
      text: `Валидному комментарию достаточно этого поля`,
    };
    let response;

    beforeAll(async () => {
      response = await request(app)
        .post(`/articles/mSlg3L/comments`)
        .send(newComment);
    });

    it(`responds with 201 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    it(`returns created comment`, () => {
      expect(response.body).toEqual(expect.objectContaining(newComment));
    });

    it(`creates new comment`, async () => {
      const articleResponse = await request(app).get(`/articles/mSlg3L/comments`);

      expect(articleResponse.body.length).toBe(6);
    });
  });

  describe(`−`, () => {
    it(`responds with 404 status code when article doesn't exist`, async () => {
      const app = createAPI();
      const newComment = {
        text: `Неважно какой комментарий`,
      };

      const response = await request(app)
        .post(`/articles/NOEXIST/comments`)
        .send(newComment);

      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    it(`responds with 400 status code when required property is absent`, async () => {
      const app = createAPI();
      const validComment = {
        text: `Комментарий будет невалидным без этого поля`,
      };

      const badComment = {...validComment};
      delete badComment.text;

      const response = await request(app)
        .post(`/articles/mSlg3L/comments`)
        .send(badComment);

      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });
});

describe(`DELETE /articles/{articleId}/comments/{commentId}`, () => {
  describe(`+`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app).delete(`/articles/mSlg3L/comments/czZoLY`);
    });

    it(`responds with 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`returns deleted comment`, () => {
      expect(response.body.id).toBe(`czZoLY`);
    });

    it(`deletes certain comment`, async () => {
      const commentResponse = await request(app).get(`/articles/mSlg3L/comments`);

      expect(commentResponse.body.length).toBe(4);
    });
  });

  describe(`−`, () => {
    it(`responds with 404 status code when article doesn't exist`, async () => {
      const app = createAPI();
      const response = await request(app).delete(
          `/articles/NOEXIST/comments/hbitvV`
      );

      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    it(`responds with 404 status code when comment doesn't exist`, async () => {
      const app = createAPI();
      const response = await request(app).delete(
          `/articles/NOdhjw/comments/NOEXIST`
      );

      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});
