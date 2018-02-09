(function (service) {
    service.init = function (app, db, rootUrl, dataSrc, config) {
        var request = require('request');

        app.get(rootUrl + '/profile', getProfile);

        function getProfile(req, res, next) {
            var options = {
                url: 'http://localhost/<some-context>/profile',
                headers: {
                    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, sdch',
                    'Accept-Language':'en-US,en;q=0.8',
                    'Cookie': req.cookies.JSESSIONIDSIM
                }
            };

            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.send(body); // Show the HTML for the Google homepage.
                }

                next(null);
            })
        };
    };
})(module.exports);
