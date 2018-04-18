var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "?EMTSOJH1xWp",
    database: "mydb"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "CREATE TABLE IF NOT EXISTS users (domain VARCHAR(255), ip VARCHAR(255) PRIMARY KEY)";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });
    var sql2 = "CREATE TABLE IF NOT EXISTS data (url VARCHAR(255), time TIME, mouseX INT, mouseY INT, count INT, Created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ip VARCHAR(255), FOREIGN KEY (ip) REFERENCES users(ip))";
    con.query(sql2, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });
});