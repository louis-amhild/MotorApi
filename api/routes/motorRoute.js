'use strict';
const Motor = require('../controllers/motor');
const WebSocket = require('ws');

let motor = null;
let wss = null;
let statusListners = [];

class MotorRoute {
    constructor(app) {
        console.log("Constructor of motor route running");
        this.test = "lalala";
        app.route('/motor/pin/:pin')
        .get(this.readPin.bind(this))
        .put(this.writePin.bind(this));

        app.route('/motor/start')
        .put(this.startMotor.bind(this));

        app.route('/motor/stop')
        .put(this.stopMotor.bind(this));

        app.route('/motor/step')
        .put(this.stepMotor.bind(this));

        app.route('/motor/speed')
        .get(this.getSpeed.bind(this))
        .put(this.setSpeed.bind(this));

        app.route('/motor/status')
        .get(this.getStatus.bind(this))
    };

    setServer(server) {
        //console.log("Set server", server);
        this.server = server;
        console.log("Im here:", this);
    }

    init() {
        // Init motor wrapper
        motor = new Motor(this.broadcastStatus);
        motor.init();
    }

    destroy() {
        if(motor) {
            motor.destroy();
        }
    }

    readPin(req, res) {
        let value = 10;
        let pin = req.params.pin;

        if (false) {
            res.send("Error");
        }

        res.json({pin: pin, value: value});
    };

    writePin(req, res) {
        let pin = req.params.pin;
        if (!req.body.value) {
            res.send("Error, please specify value in request body");
        }
        let value = req.body.value;
        res.json({pin: pin, value: value});
    };

    startMotor(req, res) {
        let json = motor.startMotor();
        res.json(json);
    };

    stopMotor(req, res) {
        let json = motor.stopMotor();
        res.json(json);
    };

    stepMotor(req, res) {
        let json = motor.stepMotor(req.body.steps);
        res.json(json);
    };

    getSpeed(req, res) {
        res.json({speed: motor.speed});
    };

    setSpeed(req, res) {
        if (!req.body.speed ) {
            res.send("Error, please specify spped in request body");
        }
        let err = motor.setSpeed(req.body.speed);
        if (err) {
            res.send("Error from motor: " + err);
        }

        res.json({ speed: motor.getSpeed()});
    };

    getStatus(req, res) {
        // // Create server status socket
        if(!wss) {
            wss = new WebSocket.Server({ port: 3001 });
            // init Websocket ws and handle incoming connect requests
            wss.on('connection', (ws) => {
                // on connect message
                // ws.on('message', function incoming(message) {
                //     console.log('received: %s', message);
                // });
                let rsp = motor.getStatus()
                rsp.msg = "Greetings client, time is " + new Date();
                ws.on('close', () => {
                  console.log('Client disconnected');
                  // TODO Handle better for now just remove all clients
                  statusListners = [];
                });
                ws.send(JSON.stringify(rsp));
                statusListners.push(ws);
            });

        }
        res.json({ws : "ws://192.168.10.120" + ":" + 3001});
    }

    broadcastStatus( status, msg ) {
        // Generate message
        status.msg = msg ? msg : "";
        // Send to all clients
        for(let ws of statusListners) {
            ws.send(JSON.stringify(status));
        }
    }
}
module.exports = MotorRoute;
