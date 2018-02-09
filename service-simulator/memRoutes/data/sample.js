(function (service) {
    service.init = function (app, db, rootUrl, dataSrc) {
        var uuid = require('node-uuid');
        var collection = db.addCollection('classes');
        var jsonfileservice = require('../../data/jsonfileservice')();
        var classes = jsonfileservice.getJsonFromFile(dataSrc + 'sample.json');
        var config = require('../../app.config');

        app.get(rootUrl + '/:orgId/sample/members', getClassMembers);
        app.get(rootUrl + '/sample', getClasses);
        app.put(rootUrl + '/sample', updateClass);
        app.post(rootUrl + '/sample', createClass);
        app.delete(rootUrl + '/sample/:systemId', deleteClass);
        app.get(rootUrl + '/sample/:classId', getClassById);
        app.put(rootUrl + '/sample/selected', setSelectedClass);

        console.log("Seeding classes list");
        classes.forEach(function (item) {
            collection.insert(item);
        });

        function copyClass(src, dest) {
            dest.category = src.category;
            dest.filter = src.filter;
            dest.description = src.description;
            dest.dismiss = src.dismiss;
            dest.action.flag = src.action.flag;
            dest.action.url = src.action.url;
            dest.action.urlText = src.action.urlText;
            dest.read = src.read;
            dest.flagged = src.flagged;
            dest.trash = src.trash;

            return dest;
        }

        function setSelectedClass(req, res, next) {
            var id = req.cookies.JSESSIONIDSIM;
            var data = req.body;

            if (config.errorCode === 200) {
                var classes = collection.where(function (item) {
                    return item.userId === id;
                });

                for (var i = 0; i < classes.length; i++) {
                    if (classes[i].systemId === data.classId && classes[i].schoolId === data.schoolId) {
                        classes[i].selected = true;
                    } else {
                        classes[i].selected = false;
                    }
                    var uDoc = collection.update(classes[i]);
                }

            } else {
                resCode = config.errorCode;
            }

            setTimeout(function () {
                res.status(config.errorCode).send(true);
            }, config.messageDelay);
        }

        function updateClass(req, res, next) {
            var id = req.cookies.JSESSIONIDSIM;
            var data = req.body;

            if (config.errorCode === 200) {
                var classes = collection.find({'systemId': id});
                var uDoc = collection.update(data);
            } else {
                resCode = config.errorCode;
            }

            setTimeout(function () {
                res.status(config.errorCode).send(true);
            }, config.messageDelay);
        }

        function deleteClass(req, res, next) {
            var systemId = req.params.systemId;

            if (config.errorCode === 200) {
                var classItem = collection.find({'systemId': systemId});
                if (classItem.length > 0) {
                    var uDoc = collection.remove(classItem[0]);
                }
            } else {
                resCode = config.errorCode;
            }

            setTimeout(function () {
                res.status(config.errorCode).send(true);
            }, config.messageDelay);
        }

        function createClass(req, res, next) {
            var id = req.cookies.JSESSIONIDSIM;
            var data = req.body;

            if (config.errorCode === 200) {
                data.systemId = uuid.v1();
                data.iri = data.systemId;
                data.userId = id;
                delete data.$loki;
                delete data.meta;
                collection.insert(data);
            } else {
                resCode = config.errorCode;
            }

            setTimeout(function () {
                res.status(config.errorCode).send(true);
            }, config.messageDelay);
        }

        function getClasses(req, res, next) {
            var id = req.cookies.JSESSIONIDSIM;
            var classId = req.params.classId;

            var classes = collection.where(function (item) {
                return true;
            });
            var retVal = {
                "orgId": "",
                "totalItems": classes.length,
                "items": classes
            };

            config.readRespondBack(req, res, rootUrl, retVal);
        }

        function getClassById(req, res, next) {
            var classId = req.params.classId;

            var classItem = collection.find({'systemId': classId});

            config.readRespondBack(req, res, rootUrl, classItem[0]);
        }

        function getClassMembers(req, res, next) {
            var orgId = req.params.orgId;

            var members = collection.where(function (item) {
                return item.userId === id && item.orgId === orgId;
            });

            config.readRespondBack(req, res, rootUrl, members);
        }
    };
})(module.exports);
