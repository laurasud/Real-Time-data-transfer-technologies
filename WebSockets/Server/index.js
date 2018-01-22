var WebSocketServer = require('websocket').server;
var http = require('http');
var CronJob = require('cron').CronJob;


var clients = [];
var server = http.createServer(function(request, response) {
});

server.listen(3000, function() {
    console.log("Server is listening on port: 3000");
});

wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    var index = clients.push(connection) - 1;
    var cron = new CronJob('*/10 * * * * *', function() {
        var d = new Date()
        var data = JSON.stringify({data: d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()});
        clients[0].sendUTF(data);
    }, null, true, 'America/Los_Angeles');

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log(message);
        }
    });

    connection.on('close', function(connection) {
    });
});