'use strict';

const {DataTypes, Model} = require(`sequelize`);

class Role extends Model {}

const define = (sequelize) => Role.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: `Role`,
  tableName: `roles`,
});

module.exports = define;
