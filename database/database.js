const Sequelize = require("sequelize");

const connection = new Sequelize('blog','alfredo','87075447',{
    host:'localhost',
    dialect:'mysql',
    timezone: "-03:00"
});

module.exports = connection;