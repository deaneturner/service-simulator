(function (config) {
    config.rootUrl = '/api';
    config.messageDelay = 1;
    config.errorCode = 200;
    config.errorWhen = '';
    config.readRespondBack = function (req, res, url, content) {
        var itsNotMe = true;
        var routePath = req.route.path.replace(url, '');

        if (config.errorWhen === 'all' || config.errorWhen === routePath) {
            itsNotMe = false;
        }

        setTimeout(function () {
            if (itsNotMe) {
                res.send(content);
            } else {
                res.status(config.errorCode)
                    .send({error: 'Sending error code: ' + config.errorCode + ' for route: ' + routePath});
            }
        }, config.messageDelay);
    };
    config.writeRespondBack = function (req, res, url, code) {
        var itsNotMe = true;

        if (config.errorWhen === 'all' || config.errorWhen === url) {
            itsNotMe = false;
        }

        setTimeout(function () {
            if (itsNotMe) {
                res.send(code);
            } else {
                res.send(config.errorCode);
            }
        }, config.messageDelay);

    };
    config.pagination = function(req)
    {
        return {
            page: parseInt(req.query['page']),
            pagesize: parseInt(req.query['pagesize']) * (page - 1),
            sortassending: (req.query['sortassending'] === 'true'),
            filter: req.query['filter']
        };

    };
    config.sortArrayByKey = function (array, key, ascending) {
        return array.sort(function(a, b) {
            var x = a[key];
            var y = b[key];
            var result = ((x < y) ? -1 : ((x > y) ? 1 : 0));
            if (!ascending) {
                result = -1 * result;
            }
            return result;
        });
    }

})(module.exports);
