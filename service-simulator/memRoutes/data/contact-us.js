(function (service) {
    service.init = function (app, db, rootUrl, dataSrc) {
        var uuid = require('node-uuid');
        var collection = db.addCollection('contacts');
        var jsonfileservice = require('../../data/jsonfileservice')();
        var contacts = jsonfileservice.getJsonFromFile(dataSrc + 'contact-us.json');
        var config = require('../../app.config');

        app.get(rootUrl + '/:orgId/contact-us/members', getContactMembers);
        app.get(rootUrl + '/contact-us', getContacts);
        app.put(rootUrl + '/contact-us', updateContact);
        app.post(rootUrl + '/contact-us', createContact);
        app.delete(rootUrl + '/contact-us/:systemId', deleteContact);
        app.get(rootUrl + '/contact-us/:contactId', getContactById);
        app.put(rootUrl + '/contact-us/selected', setSelectedContact);

        console.log("Seeding contacts list");
        contacts.forEach(function (item) {
            collection.insert(item);
        });

        function copyContact(src, dest) {
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

        function setSelectedContact(req, res, next) {
            var id = req.cookies.JSESSIONIDSIM;
            var data = req.body;

            if (config.errorCode === 200) {
                var contacts = collection.where(function (item) {
                    return item.userId === id;
                });

                for (var i = 0; i < contacts.length; i++) {
                    if (contacts[i].systemId === data.contactId && contacts[i].schoolId === data.schoolId) {
                        contacts[i].selected = true;
                    } else {
                        contacts[i].selected = false;
                    }
                    var uDoc = collection.update(contacts[i]);
                }

            } else {
                resCode = config.errorCode;
            }

            setTimeout(function () {
                res.status(config.errorCode).send(true);
            }, config.messageDelay);
        }

        function updateContact(req, res, next) {
            var id = req.cookies.JSESSIONIDSIM;
            var data = req.body;

            if (config.errorCode === 200) {
                var contacts = collection.find({'systemId': id});
                var uDoc = collection.update(data);
            } else {
                resCode = config.errorCode;
            }

            setTimeout(function () {
                res.status(config.errorCode).send(true);
            }, config.messageDelay);
        }

        function deleteContact(req, res, next) {
            var systemId = req.params.systemId;

            if (config.errorCode === 200) {
                var contactItem = collection.find({'systemId': systemId});
                if (contactItem.length > 0) {
                    var uDoc = collection.remove(contactItem[0]);
                }
            } else {
                resCode = config.errorCode;
            }

            setTimeout(function () {
                res.status(config.errorCode).send(true);
            }, config.messageDelay);
        }

        function createContact(req, res, next) {
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

        function getContacts(req, res, next) {
            var id = req.cookies.JSESSIONIDSIM;
            var contactId = req.params.ContactId;

            var contacts = collection.where(function (item) {
                return true;
            });
            var retVal = {
                "orgId": "",
                "totalItems": contacts.length,
                "items": contacts
            };

            config.readRespondBack(req, res, rootUrl, retVal);
        }

        function getContactById(req, res, next) {
            var contactId = req.params.contactId;

            var contactItem = collection.find({'systemId': contactId});

            config.readRespondBack(req, res, rootUrl, contactItem[0]);
        }

        function getContactMembers(req, res, next) {
            var orgId = req.params.orgId;

            var members = collection.where(function (item) {
                return item.userId === id && item.orgId === orgId;
            });

            config.readRespondBack(req, res, rootUrl, members);
        }
    };
})(module.exports);
