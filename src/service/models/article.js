'use strict';

const {DataTypes, Model} = require(`sequelize`);

class Article extends Model {}

const define = (sequelize) => Article.init({
  title: {
    type: DataTypes[`STRING`](250),
    allowNull: false,
  },
  announce: {
    type: DataTypes[`STRING`](250),
    allowNull: false,
  },
  description: {
    type: DataTypes[`STRING`](1000),
    allowNull: false,
  },
  picture: DataTypes.STRING,
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`,
});

module.exports = define;
