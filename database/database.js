const Sequelize = require("sequelize");

const connection = new Sequelize('#name','#user','#password',{
    host:'localhost',
    dialect:'mysql',
    timezone: "-03:00"
});

module.exports = connection;