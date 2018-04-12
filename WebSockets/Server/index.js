let WebSocketServer = require('websocket').server;
let express = require('express');
let app = express();
let jsfile = 'script/';
let http = require('http');
const log = require('simple-node-logger').createSimpleFileLogger('error.log');
let Data = require('./model/data');
let sucess = 0;
let error = 0;
let ip;

app.get('/script', function (req, res, err) {
   res.sendfile(jsfile + 'frontend.js');
});

app.listen('3001', function() {
    console.log("Express listening on port 3001");
});

let server = http.createServer(function(request, response) {
});

//Database
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/realtimedata');

mongoose.Promise = global.Promise;

server.listen('3000', function() {
    console.log("App listening on port 3000");
});

wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    let connection = request.accept(null, request.origin);
    //log.info('testing logger ', new Date().toJSON());
    connection.on('message', function(message) {
        ip = connection.remoteAddress;
        let obj = JSON.parse(message.utf8Data);
        obj.forEach(function (item){
            console.log ("x: " + item.mousepositionX + " y:" + item.mousepositionY, item.count);
            let data = new Data({
                url: item.url,
                IP: ip,
                time:  item.time,
                mousepositionX: item.mousepositionX,
                mousepositionY: item.mousepositionY,
                count: item.count
            });
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
        });
    });

    connection.on('close', function(connection) {
    });
});