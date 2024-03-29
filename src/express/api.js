'use strict';

const axios = require(`axios`);

const {HttpMethod} = require(`~/constants`);

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultURL = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  getArticles({userId, offset, limit, withComments} = {}) {
    return this._load(`/articles`, {
      params: {userId, offset, limit, withComments}
    });
  }

  getPopularArticles({limit} = {}) {
    return this._load(`/articles/popular`, {
      params: {limit}
    });
  }

  getArticle({id, userId, withComments}) {
    return this._load(`/articles/${id}`, {
      params: {id, userId, withComments}
    });
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategory(id, count) {
    return this._load(`/categories/${id}`, {params: {count}});
  }

  getCategories({withCount} = {}) {
    return this._load(`/categories`, {params: {withCount}});
  }

  createCategory({name}) {
    return this._load(`/categories`, {
      method: HttpMethod.POST,
      data: {
        name,
      }
    });
  }

  editCategory({id, name}) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.PUT,
      data: {
        name,
      }
    });
  }

  removeCategory({id}) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.DELETE,
    });
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data,
    });
  }

  editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data,
    });
  }

  removeArticle({id, userId}) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.DELETE,
      data: {
        userId,
      },
    });
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data,
    });
  }

  getComments({limit} = {}) {
    return this._load(`/comments`, {
      params: {
        limit,
      }
    });
  }

  removeComment({articleId, commentId, userId}) {
    return this._load(`/articles/${articleId}/comments/${commentId}`, {
      method: HttpMethod.DELETE,
      data: {
        userId,
      }
    });
  }

  createUser(data) {
    return this._load(`/users`, {
      method: HttpMethod.POST,
      data,
    });
  }

  auth(email, password) {
    return this._load(`/users/auth`, {
      method: HttpMethod.POST,
      data: {email, password},
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});

    return response.data;
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
