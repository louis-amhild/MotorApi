var express = require('express');
var app = express();
var cors = require('cors');
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var Wash = require('./api/models/washModel');
var bodyParser = require('body-parser');
var MotorRoute = require('./api/routes/motorRoute'); //importing route
var WashRoute = require('./api/routes/washRoute'); //importing route

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/WashRegistry', {useMongoClient:true});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var motorRoute = new MotorRoute(app); //register the route
var washRoute = new WashRoute(app); //register the route

var server = app.listen(port);

// register server in router in order to create status websocket
console.log("Set server now:" + motorRoute);
motorRoute.setServer(server);
motorRoute.init();

// Handle restart / close down gracefully
process.once('SIGUSR2', function () {
    motorRoute.destroy();
    process.kill(process.pid, 'SIGUSR2');
});

console.log('Motor API server started on: ' + port);
