let WebSocketServer = require('websocket').server;
let http = require('http');
const log = require('simple-node-logger').createSimpleFileLogger('error.log');
let Data = require('./model/data');
let User = require('./model/user')
let requestIP = require('request-ip');
let bodyParser = require('body-parser');
let cors = require('cors');
let express = require('express');
let app = express();
let jsfile = 'script/';
let sucess = 0;
let error = 0;

//Database
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/realtimedata');

mongoose.Promise = global.Promise;

//HTTP
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// allow cross domain connection
app.use(cors());

app.get('/script', function (req, res) {
   res.sendfile(jsfile + 'frontend.js');
   let user_domain = req.get('host');
   console.log ("hhuh" + user_domain);
   let user_ip = requestIP.getClientIp(req);
   let user = new User ({
       domain: user_domain,
       ip: user_ip,
       _data: []
   })
    user.save(function (err){
        if (err || user.domain === null|| user.ip === null){
            log.info(err, ' accepted at ', new Date().toJSON());
            console.log ("ERROR SAVING USER OR USER ALREADY EXIST");
        }
        else {
            console.log ("SUCCESS SAVING USER");
        }
    })
});

app.listen('3001', function() {
    console.log("Express listening on port 3001");
});

//WEBSOCKETS
let server = http.createServer(function(request, response) {
});

server.listen('3000', function() {
    console.log("Websockets listening on port 3000");
});

wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    let connection = request.accept(null, request.origin);
    //log.info('testing logger ', new Date().toJSON());
    connection.on('message', function(message) {
        let ip = connection.remoteAddress;
        let obj = JSON.parse(message.utf8Data);
        obj.forEach(function (item){
            console.log ("x: " + item.mousepositionX + " y:" + item.mousepositionY, item.count);
            let data = new Data({
                _id: new mongoose.Types.ObjectId(),
                url: item.url,
                IP: ip,
                time:  item.time,
                mousepositionX: item.mousepositionX,
                mousepositionY: item.mousepositionY,
                count: item.count
            });
            //Data.collection.insert(data);
            data.save(function (err){
                if (err || data.mousepositionY === null|| data.mousepositionX === null || data.time === null || data.url === null || data.IP === null || data.count === null){
                    error++;
                    log.info(err, ' accepted at ', new Date().toJSON());
                }
                else {
                    sucess++;
                }
                process.stdout.write('SUCCESS ADDING DATA: ' + sucess + '    ERROR ADDING DATA: ' + error + '\033[0G' );
            })
            User.findOne({ip: ip}, function(err,user) {
                if (err) {
                   console.log('ERROR POPULATING USERS DATA');
                 }
                else {
                    user._data.push(data._id);
                    user.save(function (err) {
                        if (err) {
                            log.info(err, ' accepted at ', new Date().toJSON())
                        }
                     });
                }
            });
        });
       /* User.find({ip: '::1'}).populate('_data').exec(function (err, user) {
            if (err) {
                console.log('ERROR FINDING USER: ');
            } else {
                console.log(JSON.stringify(user, null, 4));
            }
        });*/
    });

    connection.on('close', function(connection) {
    });
});