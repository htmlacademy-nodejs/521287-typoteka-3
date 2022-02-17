'use strict';

const help = require(`./help`);
const version = require(`./version`);
const generate = require(`./generate`);
const fill = require(`./fill`);
const fillDB = require(`./fill-db`);
const server = require(`./server`);

const Cli = {
  [help.name]: help,
  [version.name]: version,
  [generate.name]: generate,
  [fill.name]: fill,
  [fillDB.name]: fillDB,
  [server.name]: server,
};

module.exports = Cli;
