let express = require('express');
let app = express();
let longpoll = require("express-longpoll")(app);
const log = require('simple-node-logger').createSimpleFileLogger('error.log');
let cors = require ("cors");
let requestIP = require('request-ip');
let bodyParser = require('body-parser');
let dateFormat = require('dateformat');
let Data = require('./model/data');
let User = require('./model/user');
let jsfile = 'script/';
let sucess = 0;
let sucess2 = 0;
let error = 0;
let error2 = 0;

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// MONGO Database
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/realtimedata');

mongoose.Promise = global.Promise;

//MySQL Database
let mysql = require('mysql');

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "?EMTSOJH1xWp",
    database: "mydb"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    let sql = "CREATE TABLE IF NOT EXISTS users (domain VARCHAR(255), ip VARCHAR(255) PRIMARY KEY)";
    con.query(sql, function (err, result) {
        if (err) throw err;
    });
    let sql2 = "CREATE TABLE IF NOT EXISTS data (url VARCHAR(255), time DATETIME, mouseX INT, mouseY INT, count INT, Created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ip VARCHAR(255), FOREIGN KEY(ip) REFERENCES users(ip))";
    con.query(sql2, function (err, result) {
        if (err) throw err;
    });
});
//

app.get('/script', function (req, res) {
    let useragent = req.get('User-Agent');
    if (useragent === undefined) {
        res.send(500, 'Something went wrong');
    } else {
        res.sendfile(jsfile + 'frontend_lp.js');
        let user_domain = req.get('host');
        let user_ip = requestIP.getClientIp(req);
        let user = new User({
            domain: user_domain,
            ip: user_ip,
            _data: []
        })
        user.save(function (err) {
            if (err || user.domain === null || user.ip === null) {
                log.info(err, ' accepted at ', new Date().toJSON());
                console.log("ERROR SAVING USER OR USER ALREADY EXIST");
            }
            else {
                console.log("SUCCESS SAVING USER");
            }
        })
        let user2 = {domain: user_domain, ip: user_ip};
        con.query('INSERT INTO users SET ?', user2, function(err, result) {
            if (err){
                console.log("MYSQL ERROR ADDING USER OR USER ALREADY EXIST");
            }else{
                console.log("MYSQL ERROR ADDING USER");
            }
        });
    }
});

app.post('/poll', function (req, res) {
    let obj = JSON.parse(req.body.data);
    let ip = req.connection.remoteAddress;
    if (obj.length > 0){
        Array.from(obj).forEach(function (item) {
            // console.log ("x: " + item.mousepositionX + " y:" + item.mousepositionY, item.count);
            let data = new Data({
                _id: new mongoose.Types.ObjectId(),
                url: item.url,
                IP: ip,
                time: item.time,
                mousepositionX: item.mousepositionX,
                mousepositionY: item.mousepositionY,
                count: item.count
            });

            data.save(function (err) {
                if (err || data.mousepositionY === null || data.mousepositionX === null || data.time === null || data.url === null || data.IP === null || data.count === null) {
                    error++;
                    log.info(err, ' accepted at ', new Date().toJSON());
                }
                else {
                    sucess++;
                }
               // process.stdout.write('SUCCESS ADDING DATA: ' + sucess + '    ERROR ADDING DATA: ' + error + '\033[0G');
            })
            User.findOne({ip: ip}, function(err,user) {
                if (err) {
                    console.log('ERROR POPULATING USERS DATA');
                } else {
                    user._data.push(data._id);
                    user.save(function (err) {
                        if (err) {
                            log.info(err, ' accepted at ', new Date().toJSON())
                        }
                    });
                }
            });
            let date = dateFormat(item.time, "yyyy-mm-dd HH:MM:ss");
            let data2 = {
                url: item.url,
                ip: ip,
                time: date,
                mouseX: item.mousepositionX,
                mouseY: item.mousepositionY,
                count: item.count
            };
            con.query('INSERT INTO data SET ?', data2, function(err, result) {
                if (err){
                    error2++;
                    log.info(err, ' accepted at ', new Date().toJSON());
                }else{
                    sucess2++;
                }
            });
            process.stdout.write('MYSQL: SUCCESS ADDING DATA: ' + sucess2 + '    ERROR ADDING DATA: ' + error2 + '\033[0G');
        })
    }
    /* User.find({ip: '::1'}).populate('_data').exec(function (err, user) {
        if (err) {
           console.log('ERROR FINDING USER: ');
        } else {
           console.log(JSON.stringify(user, null, 4));
         }
        });*/
});

app.listen(3002, function() {
    console.log("Listening on port 3002");
});