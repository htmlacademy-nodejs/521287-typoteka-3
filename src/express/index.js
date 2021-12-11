'use strict';

const express = require(`express`);
const session = require(`express-session`);
const helmet = require(`helmet`);
const path = require(`path`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);
require(`module-alias/register`);

const router = require(`~/express/routes`);
const sequelize = require(`~/service/lib/sequelize`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const {SESSION_SECRET} = process.env;
if (!SESSION_SECRET) {
  const message = `SESSION_SECRET environment variable isn't defined`;

  throw new Error(message);
}

const app = express();

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000,
});

sequelize.sync({force: false});

app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use(helmet());
app.use(router);

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.listen(DEFAULT_PORT);
