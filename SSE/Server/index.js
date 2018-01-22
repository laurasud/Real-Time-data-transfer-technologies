var SSE = require("sse-node");
var app = require("express")();
var cors = require("cors");
var CronJob = require('cron').CronJob;

app.use(cors());

app.get("/",function (req, res){
    var client = SSE(req, res);
    var cron = new CronJob('*/10 * * * * *', function() {
        var d = new Date()
        var data = JSON.stringify({data: d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()});
        client.send(data);
    }, null, true, 'America/Los_Angeles');
});

app.listen(3001);