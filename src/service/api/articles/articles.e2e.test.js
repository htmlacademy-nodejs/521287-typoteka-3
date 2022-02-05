'use strict';

const request = require(`supertest`);

const {HttpCode} = require(`~/constants`);

const {createAPI} = require(`./utils`);
const {
  mockUsers,
} = require(`../users/users.mocks`);
const {
  mockArticles,
} = require(`../mockData`);

describe(`GET /articles`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles`);
  });

  it(`responds with 200 status code`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  it(`returns right article list`, () => {
    const length = response.body.length;
    const expected = mockArticles.length;

    expect(length).toBe(expected);
  });

  it(`returns right data`, () => {
    expect(response.body[0].title).toBe(
        mockArticles[0].title
    );
  });
});

describe(`GET /articles/{articleId}`, () => {
  const ARTICLE_ID = 3;
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles/${ARTICLE_ID}`);
  });

  it(`responds with 200 status code`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  it(`returns right data`, () => {
    const expectedTitle = mockArticles[ARTICLE_ID - 1].title;

    expect(response.body.title).toBe(expectedTitle);
  });
});

describe(`POST /articles`, () => {
  describe(`+`, () => {
    const newArticleTitle = `Созидание интереснее потребления по мнению Павла Дурова`;
    const newArticle = {
      userId: 1,
      title: newArticleTitle,
      createdAt: `2020-12-13T12:30:52.599Z`,
      categories: [1],
      announce: `Почему государству выгодно, чтобы мы потребляли больше, как это вредно с точки зрения эволюции и чем интереснее заниматься в жизни`,
      description: `Душа, как бы это ни казалось парадоксальным, спонтанно иллюстрирует конфликтный импульс, таким образом, стратегия поведения, выгодная отдельному человеку, ведет к коллективному проигрышу. Гештальт, по определению, разрушаем. Однако Э.Дюркгейм утверждал, что мышление начинает девиантный интеракционизм. Как было показано выше, лидерство последовательно`,
    };
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app).post(`/articles`).send(newArticle);
    });

    it(`responds with 201 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    it(`returns right data`, () => {
      expect(response.body.title).toEqual(newArticleTitle);
    });

    it(`creates new article`, async () => {
      const articleResponse = await request(app).get(`/articles`);

      const newArticleListLength = articleResponse.body.length;
      const expectedArticleListLength = mockArticles.length + 1;

      expect(newArticleListLength).toBe(
          expectedArticleListLength
      );
    });
  });

  describe(`−`, () => {
    const newArticle = {
      createdDate: `2020-12-13 12:30:52`,
      category: [`Продуктивность`],
      announce: `Почему государству выгодно, чтобы мы потребляли больше, как это вредно с точки зрения эволюции и чем интереснее заниматься в жизни`,
      fullText: `Душа, как бы это ни казалось парадоксальным, спонтанно иллюстрирует конфликтный импульс, таким образом, стратегия поведения, выгодная отдельному человеку, ведет к коллективному проигрышу. Гештальт, по определению, разрушаем. Однако Э.Дюркгейм утверждал, что мышление начинает девиантный интеракционизм. Как было показано выше, лидерство последовательно`,
    };
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    it(`responds with 400 status code when some required property is absent`, async () => {
      for (const key of Object.keys(newArticle)) {
        const badArticle = {...newArticle};
        delete badArticle[key];

        const response = await request(app).post(`/articles`).send(badArticle);

        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });

    it(`responds with 400 status code when field type is wrong`, async () => {
      const badArticles = [
        {...newArticle, title: true},
        {...newArticle, announce: 12345},
        {...newArticle, categories: `Котики`}
      ];

      for (const badArticle of badArticles) {
        const response = await request(app).post(`/articles`).send(badArticle);

        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });

    test(`responds with 400 status code when some field value is wrong`, async () => {
      const badArticles = [
        {...newArticle, title: `too short`},
        {...newArticle, announce: `too short announce`},
        {...newArticle, categories: []}
      ];

      for (const badArticle of badArticles) {
        const response = await request(app).post(`/articles`).send(badArticle);

        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });
  });
});

describe(`PUT /articles/{articleId}`, () => {
  const ARTICLE_ID = `3`;

  describe(`+`, () => {
    const changedArticleTitle = `Изменённый заголовок очень интересной статьи`;
    const changedArticle = {
      userId: 1,
      title: changedArticleTitle,
      createdAt: `2021-01-01T10:00:00.000Z`,
      categories: [2],
      announce: `Изменённый анонс очень интересной статьи`,
      description: `Изменённый текст`,
    };
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .put(`/articles/${ARTICLE_ID}`)
        .send(changedArticle);
    });

    it(`responds with 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`changes certain article`, async () => {
      const articleResponse = await request(app).get(`/articles/${ARTICLE_ID}`);

      const {title} = articleResponse.body;

      expect(title).toBe(changedArticleTitle);
    });
  });

  describe(`−`, () => {
    const validArticle = {
      title: `Изменённый заголовок интересной статьи`,
      createdAt: `2021-01-01T09:00:00.000Z`,
      category: [3],
      announce: `Изменённый анонс интересной статьи`,
      description: `Изменённый текст`,
    };

    it(`responds with 400 status code when article doesn't exist`, async () => {
      const app = await createAPI();

      const response = await request(app)
        .put(`/articles/NOEXIST`)
        .send(validArticle);

      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    it(`responds with 400 status code when some required property is absent`, async () => {
      const app = await createAPI();
      const invalidArticle = {...validArticle};
      delete invalidArticle.title;
      const response = await request(app)
        .put(`/articles/${ARTICLE_ID}`)
        .send(invalidArticle);

      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });
});

describe(`DELETE /articles/{articleId}`, () => {
  const USER_ID = `1`;

  describe(`+`, () => {
    const ARTICLE_ID = `2`;
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .delete(`/articles/${ARTICLE_ID}`)
        .send({userId: USER_ID});
    });

    it(`responds with 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`deletes certain article`, async () => {
      const articleResponse = await request(app).get(`/articles`);

      const {length: newLength} = articleResponse.body;
      const expectedNewLength = mockArticles.length - 1;

      expect(newLength).toBe(expectedNewLength);
    });
  });

  describe(`−`, () => {
    it(`responds with 404 status code when article doesn't exist`, async () => {
      const app = await createAPI();
      const response = await request(app)
        .delete(`/articles/NOEXIST`)
        .send({userId: USER_ID});

      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });
});

describe(`GET /articles/{articleId}/comments`, () => {
  describe(`+`, () => {
    const ARTICLE_ID = `2`;
    let response = null;

    beforeAll(async () => {
      const app = await createAPI();
      response = await request(app).get(`/articles/${ARTICLE_ID}/comments`);
    });

    it(`responds with 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`returns article comment list`, () => {
      const {length} = response.body;
      const expectedCommentLength =
        mockArticles[ARTICLE_ID - 1]
          .comments
          .length;

      expect(length).toBe(
          expectedCommentLength
      );
    });

    it(`returns right data`, () => {
      const COMMENT_ID = 0;
      const {text} = response.body[COMMENT_ID];
      const expected = mockArticles[ARTICLE_ID - 1].comments[COMMENT_ID].text;

      expect(text).toBe(expected);
    });
  });

  describe(`−`, () => {
    it(`responds with 404 status code when article doesn't exist`, async () => {
      const app = await createAPI();
      const response = await request(app).delete(`/articles/NOEXIST/comments`);

      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`POST /articles/{articleId}/comments`, () => {
  const ARTICLE_ID = `2`;

  describe(`+`, () => {
    const {
      id = `1`,
      name,
      surname,
      avatar,
    } = mockUsers[1];

    const newCommentText = `Валидному комментарию достаточно этого поля`;
    const newComment = {
      text: newCommentText,
      user: {
        id,
        name,
        surname,
        avatar,
      }
    };
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .post(`/articles/${ARTICLE_ID}/comments`)
        .send(newComment);
    });

    it(`responds with 201 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    it(`return new comment`, async () => {
      const {text} = response.body;

      expect(text).toBe(newCommentText);
    });

    it(`creates new comment`, async () => {
      const articleResponse = await request(app).get(
          `/articles/${ARTICLE_ID}/comments`
      );

      const length = articleResponse.body.length;
      const expected = mockArticles[0].comments.length + 1;

      expect(length).toBe(expected);
    });
  });

  describe(`−`, () => {
    it(`responds with 404 status code when article doesn't exist`, async () => {
      const app = await createAPI();
      const newComment = {
        text: `Неважно какой комментарий`,
      };

      const response = await request(app)
        .post(`/articles/NOEXIST/comments`)
        .send(newComment);

      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    it(`responds with 400 status code when required property is absent`, async () => {
      const app = await createAPI();
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
  const ARTICLE_ID = `1`;
  const COMMENT_ID = `1`;
  const USER_ID = `1`;

  describe(`+`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .delete(`/articles/${ARTICLE_ID}/comments/${COMMENT_ID}`)
        .send({userId: USER_ID});
    });

    it(`responds with 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`deletes certain comment`, async () => {
      const commentResponse = await request(app).get(
          `/articles/${ARTICLE_ID}/comments`
      );

      const length = commentResponse.body.length;
      const expected = mockArticles[ARTICLE_ID - 1].comments.length - 1;

      expect(length).toBe(expected);
    });
  });

  describe(`−`, () => {
    it(`responds with 400 status code when article doesn't exist`, async () => {
      const app = await createAPI();
      const response = await request(app)
        .delete(`/articles/NOEXIST/comments/${COMMENT_ID}`)
        .send({userId: USER_ID});

      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    it(`responds with 400 status code when comment doesn't exist`, async () => {
      const app = await createAPI();
      const response = await request(app).delete(
          `/articles/${ARTICLE_ID}/comments/NOEXIST`
      );

      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });
});
