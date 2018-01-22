var express = require('express');
var app = express();
var longpoll = require("express-longpoll")(app);
var cors = require ("cors");
var bodyParser = require('body-parser');
var router = express.Router();

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// ======================================================
// REGISTER ROUTES: all routes will be prefixed with /api
app.use('/', router);
// ======================================================

//longpoll.create("/poll");
longpoll.create("/poll", function (req,res,next) {
    console.log(req.query.id)
    next();
});

setInterval(function () {
    var d = new Date();
    var data = { data: d.getHours()+':'+d.getMinutes()+':'+d.getSeconds() };
    longpoll.publish("/poll", data);

}, 10000);



app.listen(3002, function() {
    console.log("Listening on port 3002");
});