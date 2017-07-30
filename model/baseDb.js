//  向外暴露有个公共的数据库链接实例
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'heimablog'
});

module.exports = connection;