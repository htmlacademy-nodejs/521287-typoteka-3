'use strict';

const buildQueryString = (o) => {
  const keys = Object.keys(o);

  let queryString = `?`;

  if (keys.length === 0) {
    return queryString;
  }

  keys.forEach((key) => {
    let value = o[key];
    let arrayString = ``;
    if (Array.isArray(value)) {
      value.forEach((arrayValue) => {
        arrayString = `${arrayString}${key}=${arrayValue}&`;
      });
      queryString = `${queryString}${arrayString}`;
      return;
    }
    queryString = `${queryString}${key}=${value}&`;
  });

  return queryString.slice(0, -1);
};

module.exports = {
  buildQueryString,
};
