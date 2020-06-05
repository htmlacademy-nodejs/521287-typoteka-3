'use strict';

const express = require(`express`);

const router = require(`./routes`);

const DEFAULT_PORT = 8080;
const app = express();

app.use(router);

app.listen(DEFAULT_PORT);
