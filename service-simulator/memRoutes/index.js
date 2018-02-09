(function (service) {
    var loki = require('lokijs');
    var db = new loki('tlsp');
    var dataSrc = '/seedData/';
    service.ssoCookies = null;
    service.sample = null;
    service.contactus = null;

    service.init = function (app, rootUrl, config, useDev, dataSrc) {
        dataSrc = '/seedData/' + (dataSrc ? dataSrc + '/' : 'dev/');

        if (useDev) {
            console.log('Using Dev to validate');
            service.ssoCookies = require('./data/ssoDevCookies').init(app, db, rootUrl, dataSrc, config);
        } else {
            console.log('Using Simulator to validate');
            service.ssoCookies = require('./data/ssoCookies').init(app, db, rootUrl, dataSrc, config);
        }
        service.sample = require('./data/sample').init(app, db, rootUrl, dataSrc, config);
        service.contactus = require('./data/contact-us').init(app, db, rootUrl, dataSrc, config);
    };

})(module.exports);
