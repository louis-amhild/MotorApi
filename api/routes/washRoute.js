'use strict';
var washCtrl = require('../controllers/washController');

class WashController {
    constructor(app) {
        app.route('/washes')
        .get(washCtrl.listAllWashes);
    };
}
module.exports = WashController;
