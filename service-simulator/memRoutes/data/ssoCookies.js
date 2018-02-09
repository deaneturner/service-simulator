(function (service) {
    service.init = function (app, db, rootUrl, dataSrc, config) {
        var collection = db.addCollection('ssoCookies');
        var jsonfileservice = require('../../data/jsonfileservice')();
        var ssoCookies = jsonfileservice.getJsonFromFile(dataSrc + 'ssoCookies.json');

        console.log("Seeding ssoCookies data");
        ssoCookies.forEach(function (item) {
            collection.insert(item);
        });

        app.get('/', setCookie);

        app.get(rootUrl + '/urls', getUrls);
        app.get(rootUrl + '/system', getSystem);
        app.get(rootUrl + '/profile', getProfile);
        app.get(rootUrl + '/profile/getByUserName', getByUserName);
        app.post(rootUrl + '/profile', saveProfile);

        function setCookie(req, res, next) {
            setTimeout(function () {
                if (config.userType.length > 0) {
                    res.cookie('JSESSIONIDSIM', config.userType);
                }
                res.cookie('schedusiteid', 'integration12');

                next(null);

            }, config.messageDelay);

        };

        function getSystem(req, res, next) {
            res.status(200).send({
                "buildVersion": "1.1-SNAPSHOT",
                "timestamp": "2015-08-31 12:31:26"
            });
        };

        function sri(req, res, next) {
            res.status(200).send('done');
        };

        function keepalive(req, res, next) {
            res.status(200).send({
                "status_code": 200,
                "maxInactiveInterval": 1800,
                "lastAccessedTime": 1437780214162,
                "creationTime": 1437780175324
            });
        };

        function logout(req, res, next) {
            res.status(200).send('done');
        };

        function getUrls(req, res, next) {
            tags = req.query['tags'] ? req.query['tags'].split(",") : [];
            retVal = {};

            tags.forEach(function (tag) {
                var item = tag.trim();

                if(item.toLowerCase() === "logout"){
                    retVal["LOGOUT"] = "/<some-context>/?GLO=true";
                }
                if (item.toLowerCase() === "keepalive") {
                    retVal["KEEPALIVE"] = "/idp/rest/keepalive";
                }

            });

            res.status(200).send(retVal);
        };

        function getProfile(req, res, next) {
            var id = req.cookies.JSESSIONIDSIM;
            var profile = collection.find({'person.userName': {'$eq': id}});
            config.readRespondBack(req, res, rootUrl, profile[0]);
        };

        function getByUserName(req, res, next) {
            id = req.query['id'] ? req.query['id'] : '';
            var profile = collection.find({'person.userName': {'$eq': id}});
            config.readRespondBack(req, res, rootUrl, profile[0]);
        };

        function saveProfile(req, res, next) {
            var id = req.cookies.JSESSIONIDSIM;
            var data = req.body;

            var profile = collection.find({'person.userName': {'$eq': data.person.userName}});

            if (profile.length > 0) {
                newProfile = copyProfile(data, profile[0]);

                if (config.errorCode === 200) {
                    collection.update(newProfile);
                }

                setTimeout(function () {
                    res.status(config.errorCode).send('done');
                }, config.messageDelay);
            } else {
                res.status(403)
            }
        };

        function copyProfile(src, dest) {
            dest.person.firstName = src.person.firstName;
            dest.person.lastName = src.person.lastName;

            return dest;
        }
    };
})(module.exports);
