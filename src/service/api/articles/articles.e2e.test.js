'use strict';

const request = require(`supertest`);

const {HttpCode} = require(`~/constants`);

const {createAPI} = require(`./utils`);
const {mockData} = require(`./mockData`);

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
    const length = mockData.length;

    expect(response.body.length).toBe(length);
  });

  it(`returns right data`, () => {
    const {id} = mockData[0];

    expect(response.body[0].id).toBe(id);
  });
});

describe(`GET /articles/{articleId}`, () => {
  const ARTICLE_ID = `ghJIDB`;
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/${ARTICLE_ID}`);
  });

  it(`responds with 200 status code`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  it(`returns right data`, () => {
    const title = mockData[3].title;

    expect(response.body.title).toBe(title);
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

      const newLength = mockData.length + 1;

      expect(articleResponse.body.length).toBe(newLength);
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
  const ARTICLE_ID = `Adjh2S`;

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
      response = await request(app)
        .put(`/articles/${ARTICLE_ID}`)
        .send(changedArticle);
    });

    it(`responds with 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`returns changed article`, () => {
      expect(response.body).toEqual(expect.objectContaining(changedArticle));
    });

    it(`changes certain article`, async () => {
      const articleResponse = await request(app).get(`/articles/${ARTICLE_ID}`);

      const newTitle = changedArticle.title;

      expect(articleResponse.body.title).toBe(newTitle);
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
        .put(`/articles/${ARTICLE_ID}`)
        .send(invalidArticle);

      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });
});

describe(`DELETE /articles/{articleId}`, () => {
  describe(`+`, () => {
    const ARTICLE_ID = `Adjh2S`;
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app).delete(`/articles/${ARTICLE_ID}`);
    });

    it(`responds with 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`returns deleted article`, () => {
      expect(response.body.id).toBe(ARTICLE_ID);
    });

    it(`deletes certain article`, async () => {
      const articleResponse = await request(app).get(`/articles`);

      const newLength = mockData.length - 1;

      expect(articleResponse.body.length).toBe(newLength);
    });
  });

  describe(`−`, () => {
    it(`responds with 404 status code when article doesn't exist`, async () => {
      const app = createAPI();
      const response = await request(app).delete(`/articles/NOEXIST`);

      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`GET /articles/{articleId}/comments`, () => {
  describe(`+`, () => {
    const ARTICLE_ID = `mSlg3L`;
    const app = createAPI();
    const article = mockData[4];
    let response;

    beforeAll(async () => {
      response = await request(app).get(`/articles/${ARTICLE_ID}/comments`);
    });

    it(`responds with 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`returns certain article comments`, () => {
      const {length} = article.comments;

      expect(response.body.length).toBe(length);
    });

    it(`returns right data`, () => {
      const {id} = article.comments[0];

      expect(response.body[0].id).toBe(id);
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
  const ARTICLE_ID = `mSlg3L`;

  describe(`+`, () => {
    const app = createAPI();
    const newComment = {
      text: `Валидному комментарию достаточно этого поля`,
    };
    const article = mockData[4];
    let response;

    beforeAll(async () => {
      response = await request(app)
        .post(`/articles/${ARTICLE_ID}/comments`)
        .send(newComment);
    });

    it(`responds with 201 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    it(`returns created comment`, () => {
      expect(response.body).toEqual(expect.objectContaining(newComment));
    });

    it(`creates new comment`, async () => {
      const articleResponse = await request(app).get(
          `/articles/${ARTICLE_ID}/comments`
      );

      const {length} = article.comments;
      const newLength = length + 1;

      expect(articleResponse.body.length).toBe(newLength);
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
        .post(`/articles/${ARTICLE_ID}/comments`)
        .send(badComment);

      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });
});

describe(`DELETE /articles/{articleId}/comments/{commentId}`, () => {
  describe(`+`, () => {
    const ARTICLE_ID = `mSlg3L`;
    const COMMENT_ID = `czZoLY`;
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app).delete(
          `/articles/${ARTICLE_ID}/comments/${COMMENT_ID}`
      );
    });

    it(`responds with 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`returns deleted comment`, () => {
      expect(response.body.id).toBe(COMMENT_ID);
    });

    it(`deletes certain comment`, async () => {
      const commentResponse = await request(app).get(
          `/articles/${ARTICLE_ID}/comments`
      );

      expect(commentResponse.body.length).toBe(4);
    });
  });

  describe(`−`, () => {
    it(`responds with 404 status code when article with comment doesn't exist`, async () => {
      const app = createAPI();
      const response = await request(app).delete(
          `/articles/NOEXIST/comments/EXIST`
      );

      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});
