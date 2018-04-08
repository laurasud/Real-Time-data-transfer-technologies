let WebSocketServer = require('websocket').server;
let http = require('http');
let Data = require('./model/data');
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

    connection.on('message', function(message) {
        let obj = JSON.parse(message.utf8Data);
        let data = new Data({
            domain: obj.domain || "No data",
            userID: obj.userID || "No data",
            time:  obj.time || "2000.01.01",
            mousepositionX: obj.mousepositionX || 0,
            mousepositionY: obj.mousepositionY || 0,
            count: 0
        });
        data.save(function (err){
            if (err){
                console.log('ERROR ADDING DATA' + err) //fiksuoti klaidas
            }
            else {
                console.log('SUCCESS ADDING DATA');
            }
        })

    });

    connection.on('close', function(connection) {
    });
});